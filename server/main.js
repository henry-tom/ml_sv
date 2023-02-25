import { Meteor } from 'meteor/meteor';

if(Meteor.isServer) {
  // When Meteor starts, create new collection in Mongo if not exists.
   Meteor.startup(function () {
       User = new Meteor.Collection('user');
   });

// GET /user - returns every message from MongoDB collection.

Router.route('/test', function () {
  var req = this.request;
  var res = this.response;
  res.end('hello asfasdf fd from free meteor js the server \n');
}, {where: 'server'});

Router.route('/users',{where: 'server'})
   .get(function(){
       var response = User.find().fetch();
       this.response.setHeader('Content-Type','application/json');
       this.response.end(JSON.stringify(response));
   })

 // POST /message - {message as post data}
 // Add new message in MongoDB collection.

   .post(function(){
       var response;
       if(this.request.body.userName === undefined || this.request.body.userPassword === undefined) {
           response = {
               "error" : true,
               "message" : "invalid data"
           };
       } else {
           User.insert({
               UserName : this.request.body.userName,
               UserPassword : this.request.body.userPassword
           });
           response = {
               "error" : false,
               "message" : "User added."
           }
       }
       this.response.setHeader('Content-Type','application/json');
       this.response.end(JSON.stringify(response));
   });

Router.route('/users/:id',{where: 'server'})

   // GET /message/:id - returns specific records

   .get(function(){
       var response;
       if(this.params.id !== undefined) {
           var data = User.find({_id : this.params.id}).fetch();
           if(data.length > 0) {
               response = data
           } else {
               response = {
                   "error" : true,
                   "message" : "User not found."
               }
           }
       }
       this.response.setHeader('Content-Type','application/json');
       this.response.end(JSON.stringify(response));
   })

   // PUT /message/:id {message as put data}- update specific records.

   .put(function(){
       var response;
       if(this.params.id !== undefined) {
           var data = User.find({_id : this.params.id}).fetch();
           if(data.length > 0) {
               if(User.update({_id : data[0]._id},{$set : {UserName : this.request.body.userName,UserPassword : this.request.body.userPassword}}) === 1) {
                   response = {
                       "error" : false,
                       "message" : "User information updated."
                   }
               } else {
                   response = {
                       "error" : true,
                       "message" : "User information not updated."
                   }
               }
           } else {
               response = {
                   "error" : true,
                   "message" : "User not found."
               }
           }
       }
       this.response.setHeader('Content-Type','application/json');
       this.response.end(JSON.stringify(response));
   })

   // DELETE /message/:id delete specific record.

   .delete(function(){
       var response;
       if(this.params.id !== undefined) {
           var data = User.find({_id : this.params.id}).fetch();
           if(data.length >  0) {
               if(User.remove(data[0]._id) === 1) {
                   response = {
                       "error" : false,
                       "message" : "User deleted."
                   }
               } else {
                   response = {
                       "error" : true,
                       "message" : "User not deleted."
                   }
               }
           } else {
               response = {
                   "error" : true,
                   "message" : "User not found."
               }
           }
       }
       this.response.setHeader('Content-Type','application/json');
       this.response.end(JSON.stringify(response));
   });
 }

// Router.route('/item', function () {
//   var req = this.request;
//   var res = this.response;
//   res.end('hello from the server\n');
// }, {where: 'server'});
