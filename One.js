//Global
//Collections are like databases, they broadcast their data to clients when it changes.
var comments = new Mongo.Collection("comments");

// Client and server code can be in the same file, or in seperate.
if (Meteor.isClient) {

  //helpers are functions/objects that on attatched to a template.
  Template.Parent.helpers({
      // we can limit a collection call and we can also sort the call.
    comments: comments.find({},{
        limit: 25,
        sort: { createdTime: -1 }
    })
  });
  
  Template.Card.helpers({
      rightNow() { return new Date() }
  });
  
  //I can also do Meteor.methods to set global methods.
  
  //Templates can have events, notation [event domElement].
  Template.Parent.events({
      'submit form': function(event, template){
          if(event.target.commentBox.value){
            
            //Login to display the right username.
            var thisUser = Meteor.user();
            var displayName;
            if(thisUser.username){
                displayName = thisUser.username;
            } else if(thisUser.emails.length > 0){
                displayName = thisUser.emails[0].address;
            } else {
                displayName = 'Anonymous';
            }
            
            // collections use basic crud operations.
            comments.insert({
                Username:displayName,
                createdTime: new Date(),
                Text:event.target.commentBox.value
            });
            event.target.commentBox.value = '';
          }
          return false;
      }
  })
}

if (Meteor.isServer) {
  Meteor.startup(function () {

    //This will clear out the comments on a server restart.
    comments.remove({});
    
    // Meteor.setInterval(function(){
    //     comments.insert({
    //         Username:'ServerBot',
    //         createdTime:new Date(),
    //         Text: 'New alert at:'+new Date()
    //     });
    // }, 1000);
    
  });
}

//Meteor doesn't have its own router, I like Iron router, of flow router.
//Router
Router.configure({
    //In iron I can configure a default template. I never made a body tag, I let meteor do that for me.
  layoutTemplate: 'Parent'
});