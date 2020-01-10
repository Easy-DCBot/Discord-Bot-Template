var Discord = require('discord.js');
var bot = new Discord.Client();
var fs  = require('fs');
const Gamedig = require('gamedig');

var ships = JSON.parse(fs.readFileSync('ships.json', 'utf8'));
var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
var recipes = JSON.parse(fs.readFileSync('recipes.json', 'utf8'));
var building = JSON.parse(fs.readFileSync('building.json', 'utf8'));
var artillery = JSON.parse(fs.readFileSync('artillery.json', 'utf8'));


bot.login(config.token);

bot.on('ready', () =>{
    console.log('Bot is online as ' + bot.user.username);
})

bot.on('error', console.error);

bot.on('message', msg => {
    if(msg.content.startsWith(config.prefix) && msg.author.id != bot.user.id){


        var input = msg.content.split(' ');
        var command = input[0].toLowerCase();
        var mess = '';
        if(input[1] === undefined || input[1] < 0){ input[1] = 1;}
        console.log(msg.author + " " + command);

        if(command === config.prefix + 'debug' && msg.author.id === config.owners[0] ||msg.content === config.prefix + 'debug' && msg.author.id === config.owners[1] ){
                msg.channel.send('The Bot is still working');
                msg.channel.send('Author :' + msg.author);
                msg.channel.send('Channel :' + msg.channel);
                msg.channel.send('Content :' + msg.content);
         }

        if(command === config.prefix + 'listbuilding'){
                var list = '';
                for(i = 0; i < building.list.length; i++){
                    list += building.list[i] + '\n';
                }
                msg.channel.send('```![Building] [Number] ```' + list)
        }

        if(command === config.prefix + 'listcooking'){
                var list = '';
                for(i = 0; i < recipes.list.length; i++){
                   list += recipes.list[i]+ '\n';
                }
                msg.channel.send('```![Recepies] [Number] ```' + list);
        }

        if(command === config.prefix + 'listship'){
                var list = '';
                for(i = 0; i < ships.list.length; i++){
                   list += ships.list[i]+ '\n';
                }
                msg.channel.send('```![Ship Types]```' + list);
        }

        if(command === config.prefix + 'listartillery'){
            var list = '';
            for(i = 0;i < artillery.list.length; i++){
                list += artillery.list[i] + '\n';
            }
            msg.channel.send('```![Artillery] [Number] ```' + list);
        }

        if(building.hasOwnProperty(command)){

                for(i = 0;i < building[command].length; i = i + 2){
                   mess += building[command][i]*input[1] + ' ' + building[command][i+1] + '\n';
                }

                if(input[1] === 1){
                     msg.channel.send('Hey ' + msg.author + ' You need:\n' + mess + "for " + input[1] + " " + command.replace("!",""));
                }else{
                     msg.channel.send('Hey ' + msg.author +' You need:\n' + mess + "for " + input[1] + " " + command.replace("!","") + "`s");
                }

        }

        if(recipes.hasOwnProperty(command)){
                for(i = 0;i < recipes[command].length; i = i + 2){
                   mess += recipes[command][i]*input[1] + ' ' + recipes[command][i+1] + '\n';
                }
                var random = Math.floor((Math.random() * 5) + 1);
                if(random === 1){
                     msg.channel.send('Bon appétit,' + msg.author + '\n' + mess);
                }
                if(random === 2){
                    msg.channel.send('Guten Hunger,' + msg.author + '\n' + mess);
                }
                if(random === 3){
                    msg.channel.send('Enjoy your mealt,' + msg.author + '\n' + mess);
                }
                if(random === 4){
                    msg.channel.send('Buon appetito,' + msg.author + '\n' + mess);
                }
                if(random === 5){
                    msg.channel.send('God aptit,' + msg.author + '\n' + mess);
                }
         }

         if(ships.hasOwnProperty(command)){
            var stuff = [0,0,0,0,0];
            for(j = 0;j < 5; j++){
                for(i = 0;i < ships[command].length; i = i + 2){
                    var temp = ships[command][i+1];
                    stuff[j] += ships[temp][j*2] * ships[command][i];
                }
            }

            var mess = '';
            for(i = 0; i < stuff.length; i++){
                mess += stuff[i] + ' ' + ships.stuff[i] + '\n';
            }

            var mess2 = '';
            for(i = 0; i < ships[command].length; i = i+2){
                mess2 +=ships[command][i] + " " + ships[command][i+1].replace("!","") + ", ";
            }


            msg.channel.send('Hey ' + msg.author + " you need :\n"+ mess + "for your " + command.replace("!","") + "\nYou need: " + mess2);
         }

        if(artillery.hasOwnProperty(command)){
            for(i = 0;i < artillery[command].length; i = i + 2){
                mess += artillery[command][i]*input[1] + ' ' + artillery[command][i+1] + '\n';
            }
            if(input[1] === 1){
                msg.channel.send('Hey ' + msg.author + ' You need:\n' + mess + "for " + input[1] + " " + command.replace("!",""));
            }else{
                msg.channel.send('Hey ' + msg.author +' You need:\n' + mess + "for " + input[1] + " " + command.replace("!","") + "`s");
            }
        }

        if(command === config.prefix + 'help'){
           const embed = new Discord.RichEmbed()
             .setTitle("**Bot Command List**")
             .setColor(0xff0000)
             .setDescription("NONE")
             .setFooter("Atlas-Discord-Bot by @Cedric_The_Lord#8166")

             msg.channel.send({embed});
        }

        if(command === config.prefix + 'player'){
            var serverport = input[1].split(':');
            var server = serverport[0];
            var port = serverport[1];
            console.log(server);
            console.log(port);
            player(server,port);

            function player (server,port){
                Gamedig.query({
                    type: 'atlas',
                    host: server,
                    port: port
                }).then((state) => {
                    var player = state['players'];
                    console.log(player);
                    mess(player);
                    return player;
                }).catch((error) => {
                    console.log("Server is offline");
                });
            }

            function mess(player){
                console.log(player);
            }


            var users = player(server,port);

        }
    }
})

