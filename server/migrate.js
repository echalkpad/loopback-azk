const server = require('./server');
const ds = server.dataSources.db;
var lbTables = ['User', 'AccessToke', 'ACL', 'RoleMapping', 'Role'];

ds.automigrate(lbTables, (err)=> {
  if (err) throw err;
  console.log('Looback tables', lbTables, 'create in', ds.adapter.name);
  ds.disconnect();
});
