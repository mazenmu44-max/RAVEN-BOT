const client = require('../bleed');
const names = require("../Models/Misc/names");

// GUILD NAMES FUNCTION
client.on('userUpdate', async (oldUser, newUser) => {
  if (oldUser.username !== newUser.username) {
    const date = new Date().toLocaleDateString("en-US")
    const time = new Date()
    function formatDate(date) {
        var d = new Date(date), month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        return [year, month, day].join('-');
    }
    const hours = time.getHours().toString().slice(0, 3).replace('13', '01').replace('14', '02').replace('15', '03').replace('16', '04').replace('17', '05').replace('18', '06').replace('19', '07').replace('20', '08').replace('21', '09').replace('22', '10').replace('23', '11')
    const data = await names.findOne({ user : newUser.id });
    if (!data) {
      let item = {};
      item.user = newUser.id
      item.names = [{
          name : newUser.username,
          type : 'username',
          date : `${formatDate(date)} ${hours}:${time.getMinutes()}:${time.getSeconds()}`
      },];
      await names.create(item).save()
    } else {
      data.names.push({
        name : newUser.username,
          type : 'username',
          date : `${formatDate(date)} ${string}:${time.getMinutes()}:${time.getSeconds()}`
      });

      await names.findOneAndUpdate({
        user: newUser.id
      }, data);
    }
  }
});