(function($){
  var fs = require('fs');
  var app = {
    members:{},
    lists:{},
    json:{
      content: null,
      container: '#json',
    },
    data:{
      file: '#file',
      btn: '#btn-load',
    },
    filter:{
      lista: '#lista',
      usuario: '#usuario',
      btn: '#btn-filter',
      btn_clear: '#btn-reset',
    },
    tmpl:{
      card: '<strong>__BOARD__</strong>: __CARD__ <br>',
    }
  };

  function filterby_user(value, json){
    var json = $.extend(true, {}, json);
    var f_json = {};

    for(var k in json){
      if( !$.inArray(value, json[k].idMembers) ){
        f_json[k] = json[k];
      }
    }

    return f_json;
  }

  function filterby_list(value, json){
    var json = $.extend(true, {}, json);
    var f_json = {};

    for(var k in json){
      if( value == json[k].idList ){
        f_json[k] = json[k];
      }
    }

    return f_json;
  }

  function parse_json(cards, members, lists){
    var container = $(app.json.container);
    var user_list = $(app.filter.usuario);
    var list_list = $(app.filter.lista);

    if(members){
      for(var m in members){
        app.members[members[m].id] = members[m].fullName;
        user_list.append('<option value="'+ members[m].id +'">'+ members[m].fullName +'</option>');
      }
    }

    if(lists){
      for(var l in lists){
        app.lists[lists[l].id] = lists[l].name;
        list_list.append('<option value="'+ lists[l].id +'">'+ lists[l].name +'</option>');
      }
    }

    container.html('');
    for(var card in cards){
      container.append(app.tmpl.card
                       .replace('__BOARD__', app.lists[cards[card].idList])
                       .replace('__CARD__', cards[card].name)
                      );
    }

  }

  function load_json(file){
    var json = fs.readFileSync(file,'utf8');

    if(json){
      json = JSON.parse(json);
      app.json.content = json;

      console.log(json);
    }
    else{
      return;
    }

    parse_json(json.cards, json.members, json.lists);
  }

  function bind_filters(){
    $(app.data.btn).on('click', function(){
      load_json( $(app.data.file).val() );
    });

    $(app.filter.btn).on('click', function(){
      var lid = $(app.filter.lista).val();
      var uid = $(app.filter.usuario).val();
      var new_cards = app.json.content.cards.slice(0);
      if( uid.replace(/-/g,'') ){ new_cards = filterby_user(uid, new_cards); }
      if( lid.replace(/-/g,'') ){ new_cards = filterby_list(lid, new_cards); }

      parse_json(new_cards, null, null);
    });

    $(app.filter.btn_clear).on('click', function(){
      parse_json(app.json.content.cards, null, null);
    });
  }

  $(document).ready(function(){
    bind_filters();
  });
})(jQuery);
