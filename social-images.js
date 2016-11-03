yaml = require('js-yaml');
fs   = require('fs');
recursive = require('recursive-readdir');
cp = require('child_process');

function load(filename) {
  var data = fs.readFileSync(filename, 'utf8');

  var content;
  var i = data.indexOf("\n---\n\n");
  if (i > 0) {
    content = data.substring(i+5);
    data = data.substring(0, i);
  }

  var res;
  yaml.safeLoadAll(data, function (doc) {
    if (doc) res = doc;
  });

  res.content = content;
  return res;
}

function save(filename, doc, content) {
  var res = "---\n" + yaml.safeDump(doc) + "---\n";
  if (content) res += "\n" + content;
  fs.writeFileSync(filename, res);
}
 
recursive('categories', function (err, files) {
  // Files is an array of filename
  files = files.filter(function(name){
    return name.match(/_posts\/201\d-\d\d-\d\d-.*\.md$/)
  })
  
  files.map(function(filename){
    var a = filename.split('/');
    name = a[a.length-1];
    name = name.split('.')[0];
    name = name.substr(11);

    var doc = load(filename);
    
    cp.spawn('./scripts/post-social-image.sh', [name, doc.title], {stdio: 'inherit'});
  })
});

/*
fs.readdirSync(srcdir).forEach(function(catfoldername) {
  var catdir = srcdir + '/' + catfoldername;
  if (fs.lstatSync(catdir).isDirectory()) {
    fs.readdirSync(catdir).forEach(function(filename) {
      if (filename.match(/\d\d\d\d-\d\d-\d\d-.*\.md/)) {
        console.log(filename);
        var date = filename.substring(0, 10);
        var slug = filename.substring(11, filename.length - 3);
        var dir = dstdir + '/' + date + '-' + slug;

        try {
          fs.accessSync(dir, fs.F_OK);
        } catch (e) {
          fs.mkdirSync(dir);
        }

        var doc = load(catdir + '/' + filename);

        var links = {
          listbuilder: '/listbuilder/' + slug + '/',
          ok: '/listbuilder-ok/' + slug + '/',
          enjoy: '/enjoy/' + slug + '/' + doc.event + '/',
          summary: '/episode/' + date + '-' + slug + '/summary/',
          buy: '/buy-episode/' + slug + '/',
          paid: '/paid-episode/' + slug + '/' + doc.event + '/',
          live: '/live/' + slug + '/',
        }

        var listbuilder = {
          title: doc.title,
        }

        if (doc.introtext) listbuilder.introtext = doc.introtext;
        if (doc.program) listbuilder.program = doc.program;
        if (doc.gains) listbuilder.gains = doc.gains;

        listbuilder.permalink = links.listbuilder;
        listbuilder.redirect = links.ok;
        listbuilder.layout = 'listbuilder';

        save(dir + '/listbuilder.md', listbuilder);

        save(dir + '/listbuilder-ok.md', {
          permalink: links.ok,
          redirect: links.enjoy,
          layout: 'listbuilder-ok'
        });

        save(dir + '/enjoy.md', {
          title: doc.title,
          stream: doc.stream,
          event: doc.event,
          permalink: links.enjoy,
          layout: 'enjoy'
        });

        save(dir + '/summary.md', {
          title: doc.title,
          layout: 'summary',
          permalink: links.summary,
          buy: links.buy
        }, doc.content);

        save(dir + '/buy.md', {
          title: doc.title,
          permalink: links.buy,
          redirect: links.paid,
          layout: 'buy-episode',
        });

        save(dir + '/paid.md', {
          permalink: links.paid,
          redirect: links.enjoy,
          layout: 'paid-episode'
        });

        save(dir + '/late.md', {
          permalink: links.live,
          redirect: '/late/',
          layout: 'live-late'
        });
      }
    })
  }
})
*/