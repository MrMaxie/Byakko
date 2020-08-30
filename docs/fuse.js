const fs = require('fs');
const { join } = require('path');
const { task, watch, exec } = require('fuse-box/sparky');
const ejs = require('ejs');
const yaml = require('yaml');
const _sortBy = require('lodash.sortby');
const { Parser, HtmlRenderer } = require('commonmark');
const StaticServer = require('static-server');
const util = require('util');

const writeFile = util.promisify(fs.writeFile);

const glob = require('glob');

const getMdFiles = () => new Promise((res, rej) => {
    glob('*.md', {
        cwd: join(__dirname, 'src', 'md'),
    }, (err, m) => {
        if (err) {
            rej(err);
            return;
        }

        res(m);
    })
});

const readFile = path => new Promise((res, rej) => {
    fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
            rej(err);
            return;
        }

        res(data);
    });
});

task('build', async () => {
    const mdsPaths = await getMdFiles();
    const mds = await Promise.all(mdsPaths.map(x => join(__dirname, 'src', 'md', x)).map(readFile));
    const entries = mds.map(x => {
        let header = {};
        let body = x;

        if (/^[\s\r\n]*-{3}/.test(x)) {
            const [, h, ...r] = x.split('---');
            header = yaml.parse(h);
            body = r.join('---');
        }

        return { ...header, body };
    });

    const svgs = [];

    entries.forEach(x => {
        x.body = (new HtmlRenderer()).render((new Parser()).parse(x.body || ''));
        (x.body.match(/~~([^\s]+\.svg)/gi) || []).forEach(y => {
            svgs.push({
                entry: x,
                from: y,
                path: y.replace(/~/g, ''),
            });
        });
        x.order = x.order || 999;
        x.orderName = (x.name || '').toLowerCase();
        x.type = x.type || '';
        x.typeChar = (x.type || ' ')[0].toLowerCase();
        x.hash = x.name.replace('.', '').replace(/\d/, '').trim().replace(' ', '-');
    });

    await Promise.all(
        svgs.map(x =>
            readFile(join(__dirname, 'src', x.path)).then(c => {
                x.entry.body = x.entry.body.replace(x.from, c);
            })
        )
    );

    const sortedEntries = _sortBy(entries, ['order', 'orderName']);

    const res = await ejs.renderFile(join(__dirname, 'src', 'index.ejs'), { items: sortedEntries });
    await writeFile(join(__dirname, 'dist', 'index.html'), res, { encoding: 'utf8' });
    return true;
});

task('build:watch', ['build'], () => {
    const server = new StaticServer({
        rootPath: join(__dirname, 'dist').concat('\\'),
        port: 9090,
    })

    server.start();

    return watch('src/**/**.{md,ejs,svg}', {
        base: __dirname,
    }, () => exec('build'));
});