const sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database('data/final_frontier.db')


/** @module createDatabase
 * Initializes a sqlite database with tables 
 * for article, audio, video, and gallery.
 * @param {createDatabase~callback} cb - callback invoked when done
 */
module.exports = function createDatabase(cb) {
  console.log('Initializing database...')
  
  var sql = `
    DROP TABLE IF EXISTS article;
    CREATE TABLE article (
      id INTEGER PRIMARY KEY,
      title TEXT,
      body TEXT,
      type TEXT NOT NULL DEFAULT 'article'
    );

    DROP TABLE IF EXISTS audio;
    CREATE TABLE audio (
      id INTEGER PRIMARY KEY,
      title TEXT,
      description TEXT,
      source TEXT,
      type TEXT NOT NULL DEFAULT 'audio'
    );

    DROP TABLE IF EXISTS video;
    CREATE TABLE video (
      id INTEGER PRIMARY KEY,
      title TEXT,
      description TEXT,
      source TEXT,
      type TEXT NOT NULL DEFAULT 'video'
    );

    DROP TABLE IF EXISTS gallery;
    CREATE TABLE gallery (
      id INTEGER PRIMARY KEY,
      title TEXT,
      description TEXT
      type TEXT NOT NULL DEFAULT 'gallery'
    );

    -- table of gallery image paths
    DROP TABLE IF EXISTS gallery_images;
    CREATE TABLE gallery_images (
      id INTEGER PRIMARY KEY,
      gallery_id INTEGER,
      source TEXT,

      FOREIGN KEY (gallery_id) REFERENCES gallery (id)
    );

    -- seed initial data
    INSERT INTO article (title, body)
    VALUES
      ('Article 1', '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eget erat nunc. Donec vitae maximus quam, vel laoreet metus. Sed iaculis magna at erat malesuada sagittis a sit amet dolor. Ut sollicitudin ultrices lectus, non posuere magna molestie vitae. Praesent eget lorem varius, faucibus ipsum in, dapibus velit. Morbi pretium, libero in rutrum auctor, sapien turpis ultrices orci, et pharetra turpis leo nec leo. Donec in laoreet leo. Aliquam at ipsum sit amet augue mattis consequat in sit amet tortor. Sed id magna eros. Nam pulvinar egestas nibh viverra blandit.Cras nisl quam, suscipit eget nulla et, porttitor cursus felis. Morbi lobortis odio imperdiet auctor suscipit. Nullam ut placerat dui, sit amet ultrices erat. Aliquam vel maximus nibh. Morbi eu vehicula nibh. Aenean in leo felis. Cras bibendum consectetur bibendum. Integer non interdum ligula, et luctus dolor. Phasellus scelerisque, justo non condimentum malesuada, enim massa interdum diam, sed placerat odio sapien ut magna. In et tortor id lectus lobortis tristique. In a ornare ligula, quis venenatis sem. Suspendisse eget tincidunt ligula, ut finibus risus. Aliquam erat volutpat. Sed quis felis magna. Integer molestie, felis non sagittis porta, metus neque suscipit est, a tempor felis justo vitae elit. Morbi dui ligula, congue eu rhoncus et, vehicula mattis nulla.Maecenas viverra quis nunc at vehicula. Etiam congue congue dictum. Cras aliquet arcu felis, ut elementum nisi varius eu. Nunc euismod, erat sed ornare porta, risus purus porta risus, eu ullamcorper lacus nisl eget lectus. Nunc auctor tristique risus, ut accumsan urna semper ut. Ut varius risus eget eros varius condimentum. Vestibulum in euismod nisl. Proin lectus turpis, hendrerit sit amet pretium varius, iaculis eu odio. Nam ligula lectus, volutpat nec lacus sit amet, laoreet tincidunt ante. Fusce elit magna, blandit vitae dignissim in, aliquet sed dolor. Maecenas sollicitudin tellus ac turpis mollis gravida. Aenean odio arcu, commodo in laoreet at, faucibus sed magna. Sed dapibus aliquam ex id finibus. Mauris placerat, ante at efficitur placerat, mi justo dignissim leo, ullamcorper vulputate mauris sapien vitae orci. Ut congue ex pretium nisi efficitur maximus.Fusce hendrerit, libero ut laoreet blandit, dui augue dictum turpis, id imperdiet arcu leo id lorem. Suspendisse facilisis egestas ex vel tincidunt. Duis porttitor tristique diam. Fusce eu augue vitae est ultricies vehicula non et massa. Donec sagittis interdum posuere. Nulla facilisi. Phasellus efficitur placerat purus, sed volutpat quam lobortis sed. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. In consequat massa quis ex porttitor, ut aliquam libero convallis. Sed rutrum sed mauris non posuere. Aenean gravida aliquet arcu sed fermentum. Ut consequat et purus vitae elementum. Curabitur eget eros non mauris vestibulum placerat. Phasellus ut nisl vel diam sodales faucibus.Vivamus eu elit sit amet risus convallis facilisis sed vel nisi. Nulla at sollicitudin neque. Ut sed massa sed odio feugiat gravida. Sed in gravida ipsum. Sed suscipit interdum interdum. Vivamus id magna a ex efficitur scelerisque. Ut enim odio, dapibus ut congue quis, lacinia placerat arcu. Nam aliquam nisi at lorem sodales cursus. Sed id neque a dui porttitor rhoncus. Sed tristique blandit iaculis. Suspendisse blandit nibh metus, ac tristique enim convallis id.</p>');
  `
  
  db.exec(sql, cb)
  
  db.close()
}

/** @callback createDatabase~callback
 * @param {string|object} err - any error that occured
 */