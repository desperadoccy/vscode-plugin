$("#postdd").click(function() {
    var context=$("value").value;
    $.ajax({
        type: 'POST',
        url: "localhost/test.php",//url
        contentType: "application/json",
        data: JSON.stringify({qustion:context}),//JSON.stringify()
        dataType: "jsonp",//期待返回的数据类型
        success: function(data){
            $("codesnippet1").innerhtml(data.codesnippet1);
            $("codesnippet2").innerhtml(data.codesnippet2);
            $("codesnippet3").innerhtml(data.codesnippet3);
        },
        error:function(data){
            alert("error!!!"); 
        }
      });
});