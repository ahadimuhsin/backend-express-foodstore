const User = require("../user/model");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("../config");
const { getToken } = require("../utils/get-token");

//function register
async function register(req, res, next) {
  try {
    //ambil isi dari request
    const payload = req.body;
    //buat objek user baru
    let user = new User(payload);
    //simpan ke user baru di mongoDB
    await user.save();

    return res.json(user);
  } catch (error) {
    if (error && error.name === "ValidationError") {
      return res.json({
        error: 1,
        message: error.message,
        fields: error.errors,
      });
    }
    next(error);
  }
}

//untuk local strategy
async function localStrategy(email, password, done) {
  try {
    //cari user ke mongoDB
    let user = await User.findOne({ email }).select(
      "-__v -createdAt -updatedAt -cart_items -token"
    );
    // console.log(user);
    //jika user tidak ditemukan, akhiri
    if (!user) return done();
    //jika user ditemukan, cek passwordnya sesuai atau tidak
    if (bcrypt.compareSync(password, user.password)) {
      ({ password, ...userWithoutPassword } = user.toJSON());

      return done(null, userWithoutPassword);
    }
  } catch (error) {
    done(error, null);
  }
  done();
}

//login
async function login(req, res, next) {
  passport.authenticate("local", async function (err, user) {
    //menangani error
    if (err) {
      return next(err);
    }

    //jika user tidak ditemukan
    if (!user) {
      return res.json({
        error: 1,
        message: "Email atau password salah",
      });
    }

    //jika user ditemukan
    //buat json web token
    let signed = jwt.sign(user, config.secretKey);

    //simpan token ke user terkait
    await User.findOneAndUpdate(
      { _id: user._id },
      { $push: { token: signed } },
      { new: true }
    );

    return res.json({
      message: "login success!",
      user: user,
      token: signed,
    });
  })(req, res, next);
}

//mengetahui data yg sedang login
function me(req, res, next)
{
  if(!req.user)
  {
    return res.json({
      error: 1,
      message: 'You are not logged in or token expired'
    });
  }
  return res.json(req.user);
}

//logout
async function logout(req, res, next)
{
  //ambil token dari request
  let token = getToken(req);

  //hapus token dari user
  let user = await User
  .findOneAndUpdate(
    {token: {$in:[token]}}, 
    {$pull: {token}},
    {useFindAndModifyFalse: false});
  
    //cek user atau token
    //kalo user/token gak ada
    if(!user || !token)
    {
      return res.json({
        error: 1,
        message: 'No user found'
      });
    }

    //kalo ada, logout berhasil
    return res.json({
      error: 0,
      message: 'Logout Berhasil'
    });
}

module.exports = {
  register,
  localStrategy,
  login,
  me,
  logout
};
