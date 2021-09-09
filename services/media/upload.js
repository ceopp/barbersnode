module.exports = async function (f, opts) {
    //console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!file!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    const fs = require('fs');
    const sharp = require('sharp');
    f.post('/upload', {
        schema: {
            tags: ['media'],
            body: {
                type: 'object',
                properties: {
                    file: { type: 'object' }
                },
                required: ['file']
            },
            security: [{ 'Authorization': [] }]
        },
        onRequest: f.auth,
    }, async (req, res) => {
        const file = req.body.file;
        if (!file) return res.badRequest('file is required');
        const ext = file.name.split('.').pop();
        const md5 = f.crypto.randomHexString(32);
        let name480 = `${md5}.480.${ext}`;
        let path480 = `${__basedir}/uploads/${name480}`;
        try {
            await sharp(file.tempFilePath).resize({ height: 480 }).toFile(path480);
            res.send(`${f.config.web_scheme}://${f.config.web_host}/uploads/${name480}`);
        } catch (e) {
            log.e(e);
            res.badRequest('Bad file');
        } finally {
            fs.unlink(file.tempFilePath, (_) => { });
        }
    });
};
