const Tag = require('./model');

async function store(req, res, next){
    try{
         // Cek policy
         let policy = policyFor(req.user);

         if(!policy.can('create', 'Tag')){
             return res.json({
                 error: 1,
                 message: `Anda tidak memiliki akses untuk membuat tag`
             });
         }
        //ambil data dari request
        let payload = req.body;

        //buat objek Tag baru
        let tag = new Tag(payload);

        //simpan tag ke mongoDB
        await tag.save();

        //return response ke client
        return res.json(tag);
    }
    catch(err){
        //tangani kemungkinan error validasi
        if(err && err.name === 'ValidationError')
        {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        }
        next(err);
    }
}

async function update(req, res, next){
    try{
         // Cek policy
         let policy = policyFor(req.user);

         if(!policy.can('update', 'Tag')){
             return res.json({
                 error: 1,
                 message: `Anda tidak memiliki akses untuk mengupdate tag`
             });
         }
        //ambil data dari request
        let payload = req.body;

        //buat objek Tag baru
        let tag = await Tag.findOneAndUpdate({_id: req.params.id}, payload,
            {new: true, runValidators: true});

        //simpan tag ke mongoDB
        await tag.save();

        //return response ke client
        return res.json(tag);
    }
    catch(err){
        //tangani kemungkinan error validasi
        if(err && err.name === 'ValidationError')
        {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        }
        next(err);
    }
}

async function destroy(req, res, next)
{
    try{
         // Cek policy
         let policy = policyFor(req.user);

         if(!policy.can('delete', 'Tag')){
             return res.json({
                 error: 1,
                 message: `Anda tidak memiliki akses untuk menghapus tag`
             });
         }
        let tag = await Tag.findOneAndDelete({_id: req.params.id});
        return res.json({
            title: 'success',
            message: 'Tag deleted successfully'
        });
    }
    catch(err)
    {
        next(err);
    }
}

module.exports = {
    store,
    update,
    destroy
}