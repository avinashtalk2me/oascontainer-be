
const config = {
    user: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        trustedconnection: true,
        enableArithAbort: true,
        instancename: process.env.DB_INSTANCE,
        trustServerCertificate: true

    },
    port: 1433
}

module.exports = config;


// const config = {
//     user :'sa',
//     password :'scottiger',
//     server:'127.0.0.1',
//     database:'containerPack',
//     options:{
//         trustedconnection: true,
//         enableArithAbort : true, 
//         instancename :'SQLEXPRESS2019',
//         trustServerCertificate: true
//     },
//     port : 1433
// }

// module.exports = config; 