const csv = require('csvtojson');
const { resolveSrv } = require('dns/promises');
const path = require('path');

//mendapatkan data provinsi dari file csv
async function getProvinsi(req, res, next)
{
    //ambil file csv provinsi
    const db_provinsi = path.resolve(__dirname, './data/provinces.csv');

    try{
        const data = await csv().fromFile(db_provinsi);
        return res.json(data);
    }
    catch(err)
    {
        return res.json({
            error: 1,
            message: 'Tidak bisa mengambil data provinsi'
        });
    }
}

//mendapatkan data kabupaten/kota berdasarkan pilihan provinsi
async function getKabupaten(req, res, next)
{
    //ambil file csv kabupaten
    const db_kabupaten = path.resolve(__dirname, './data/regencies.csv');
    try{
        let {kode_induk} = req.query;
        const data = await csv().fromFile(db_kabupaten);
        if(!kode_induk){
            return res.json(data);
        }
        //filter kode provinsi yg sama dengan query yang masuk
        return res.json(data.filter(kabupaten => kabupaten.kode_provinsi === kode_induk));
    }
    catch(err)
    {
        return res.json({
            error: 1,
            message: 'Tidak bisa mengambil data kabupaten'
        });
    }
}

//mendapatkan data kecamatan berdasarkan pilihan kabupaten/kota
async function getKecamatan(req, res, next)
{
    //ambil file csv kabupaten
    const db_kecamatan = path.resolve(__dirname, './data/districts.csv');
    try{
        let {kode_induk} = req.query;
        const data = await csv().fromFile(db_kecamatan);
        if(!kode_induk){
            return res.json(data);
        }
        //filter kode provinsi yg sama dengan query yang masuk
        return res.json(data.filter(kecamatan => kecamatan.kode_kabupaten === kode_induk));
    }
    catch(err)
    {
        return res.json({
            error: 1,
            message: 'Tidak bisa mengambil data kecamatan'
        });
    }
}

//mendapatkan data desa berdasarkan pilihan kecamatan
async function getDesa(req, res, next)
{
    //ambil file csv kabupaten
    const db_desa = path.resolve(__dirname, './data/villages.csv');
    try{
        let {kode_induk} = req.query;
        const data = await csv().fromFile(db_desa);
        if(!kode_induk){
            return res.json(data);
        }
        //filter kode provinsi yg sama dengan query yang masuk
        return res.json(data.filter(desa => desa.kode_kecamatan === kode_induk));
    }
    catch(err)
    {
        return res.json({
            error: 1,
            message: 'Tidak bisa mengambil data desa'
        });
    }
}

module.exports = {
    getProvinsi,
    getKabupaten,
    getKecamatan,
    getDesa
}