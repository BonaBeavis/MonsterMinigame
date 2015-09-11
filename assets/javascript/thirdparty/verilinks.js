"use strict"

var Verilinks = (function($) {
    var links = {
        current: {},
        verified: [],
        addLink: function(link) {
            this.current = link;
            this.verified.push(link);
        }
    };
    var test = {};

    function init(linkset, templateId, user, verilinksServerUrl) {
        requestTemplate(templateId, verilinksServerUrl);
    }

    function requestTemplate(templateId, verilinksServerUrl) {
        var reqData = {
            service: "getTemplate",
            template: templateId
        }
        $.get(verilinksServerUrl, reqData,
            function(template) {
                $.templates(templateId, template);
            });
    }

    function requestLink(linkset, user, verilinksServerUrl) {
        var reqData = {
            service: "getLink",
            curLink: links.current.Id,
            verification: links.current.verification,
            linkset: linkset,
            userId: user.Id,
            userName: user.name,
            verifiedLinks: links.verified.join(" ")
        };
        $.get(verilinksServerUrl, reqData,
            function(link) {
                test = link;
            });
    }

    function generateLinkRequestURL() {}

    return {
        init: init,
    }
})(jQuery);

var user

Verilinks.init("", "dbpedia-factbook", "", "http://localhost:8080/server");
