if (Meteor.isClient) {
  Session.setDefault("selectedArticleId", null)
  Session.setDefault("pageNr", 0)
  PAGE_SIZE = 5 
  Template.article_list.page = function() {
    var pageNr = Session.get("pageNr")
    var query = {};
    var articles = Articles.find(query, {
      limit: PAGE_SIZE,
      skip: pageNr
    })
    var total = Articles.find(query, {
      reactive: false
    }).count();
    var page = {
      pageNr: pageNr,
      articles: articles,
      total: total,
      hasPrev: page > 0
    }
    return page;
  };
  Template.article_list.events = {

    "click .next": function() {
      var pageNr = Session.get("pageNr");
      Session.set("pageNr", pageNr + 1);
    },
    "click .prev": function() {
      var pageNr = Session.get("pageNr");
      Session.set("pageNr", pageNr - 1);
    }
  }
  Template.selected_article.articleSelected = function() {
    return !!selectedArticle()
  }

  function selectedArticle() {
    var id = Session.get("selectedArticleId")
    if (id) {
      var article = Articles.findOne(id);
      return article;
    }
  }
  Template.selected_article.article = function() {
    return selectedArticle()
  };
  Template.article_list_item.events = {
    "click .media": function(e, template) {
      Session.set("selectedArticleId", template.data._id)
    }
  }
}
if (Meteor.isServer) {
  Meteor.startup(function() {
    // code to run on server at startup
    var DEMO_COUNT = 3000;
    if (!Articles.find().count()) {
      for (var i = 0; i < DEMO_COUNT; i++) {

        Articles.insert({
          title: "My Article " + i,
          teaser: dimsum.sentence(2),
          text: dimsum(3)
        });
        if(i%1000===0){
          console.log("Created "+ i +" Articles")
        }
      };
      console.log("Created Demo Articles")
    }
  });
}
Articles = new Meteor.Collection("articles");