$(function () {
    var template, count = 1
        , flag = true;
    var h = $(window).height();
    $('#sendBox').on('click', function () {
            var content = $("#contentInput").val().trim()
                , Per;
            if (content == "") {
                return false;
            }
            count++;
            if (!flag) {
                template.find(".talkContent").text(content);
                $(".bodySection").append(template);
                $("#contentInput")[0].value = "";
                template = template.clone();
                $(window).scrollTop(h * count);
                return false;
            }
            flag = false;
            Per = createChatTemplate(content);
            $("#contentInput")[0].value = "";
            template = Per.clone();
        })
        /*上传图片*/
    $(".RightIcon").on("click", function () {
        var Per, url = './images/1.jpg';
        if (url === '') return false;
        var uploadImg = $("<img/>").attr("src", url);
        count++;
        if (!flag) {
            template.find(".talkContent").html(uploadImg);
            $(".bodySection").append(template);
            template = template.clone();
            $(window).scrollTop(h * count);
            return false;
        }
        flag = false;
        Per = createChatTemplate(uploadImg);
        template = Per.clone();
    })
});

function createChatTemplate(content) {
    var contentEl = $("<div/>").addClass('talkContent')
        , imgEl = $("<img/>").attr('src', './images/1.jpg')
        , imgbox = $('<div/>').addClass("talkImg")
        , talkEl = $("<div/>").addClass("talkInfo")
        , timeEl = $("<p/>").addClass("talkTime")
        , perTalk = $("<section/>").addClass("perTalk");
    var time = new Date()
        , year = time.getFullYear()
        , month = time.getMonth() + 1
        , day = time.getDate()
        , hours = time.getHours()
        , min = time.getMinutes()
        , seconds = time.getSeconds()
        , showTime = hours + ":" + min + ":" + seconds + " " + month + "/" + day + "/" + year;
    contentEl.html(content);
    timeEl.text(showTime);
    imgbox.append(imgEl);
    talkEl.append(imgbox).append(contentEl);
    perTalk.append(timeEl).append(talkEl);
    $(".bodySection").append(perTalk);
    return perTalk;
}