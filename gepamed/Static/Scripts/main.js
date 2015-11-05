$(function() {
    var detailLink = $('.detail-link');
    var lastId,
        topMenu = $("#top-menu"),
        topMenuHeight = topMenu.outerHeight(),
        menuItems = topMenu.find(".navigation a"),
        scrollItems = menuItems.map(function() {
            var item = $($(this).attr("href"));
            if (item.length) {
                return item;
            }
        });

    menuItems.click(function(e) {
        var href = $(this).attr("href"),
            offsetTop = href === "#" ? 0 : $(href).offset().top - topMenuHeight + 1;
        $('html, body').stop().animate({
            scrollTop: offsetTop
        }, 800);
        e.preventDefault();
    });

    $(window).scroll(function() {
        var fromTop = $(this).scrollTop() + topMenuHeight;

        var cur = scrollItems.map(function() {
            if ($(this).offset().top < fromTop)
                return this;
        });

        cur = cur[cur.length - 1];
        var id = cur && cur.length ? cur[0].id : "";

        if (lastId !== id) {
            lastId = id;
            menuItems
                .parent().removeClass("active")
                .end().filter("[href='#" + id + "']").parent().addClass("active");
        }
    });

    $('tr[data-id].packages-content__expanded').hide();

    detailLink.click(function(e) {
        e.preventDefault();
        $(this).toggleClass('active');
        var id = $(this).attr('data-id');
        $('tr[data-id="' + id + '"].packages-content__expanded').toggle();
    });

    $('#nav-collapse').click(function() {
        $(this).toggleClass('is-active');
        $('.menu-toggler').toggleClass('show');
    });

});

$.scrollLock = (function scrollLockClosure() {
    'use strict';

    var $html = $('html'),
        // State: unlocked by default
        locked = false,
        // State: scroll to revert to
        prevScroll = {
            scrollLeft: $(window).scrollLeft(),
            scrollTop: $(window).scrollTop()
        },
        // State: styles to revert to
        prevStyles = {},
        lockStyles = {
            'overflow-y': 'scroll',
            'position': 'fixed',
            'width': '100%'
        };

    // Instantiate cache in case someone tries to unlock before locking
    saveStyles();

    // Save context's inline styles in cache
    function saveStyles() {
        var styleAttr = $html.attr('style'),
            styleStrs = [],
            styleHash = {};

        if (!styleAttr) {
            return;
        }

        styleStrs = styleAttr.split(/;\s/);

        $.each(styleStrs, function serializeStyleProp(styleString) {
            if (!styleString) {
                return;
            }

            var keyValue = styleString.split(/\s:\s/);

            if (keyValue.length < 2) {
                return;
            }

            styleHash[keyValue[0]] = keyValue[1];
        });

        $.extend(prevStyles, styleHash);
    }

    function lock() {
        var appliedLock = {};

        // Duplicate execution will break DOM statefulness
        if (locked) {
            return;
        }

        // Save scroll state...
        prevScroll = {
            scrollLeft: $(window).scrollLeft(),
            scrollTop: $(window).scrollTop()
        };

        // ...and styles
        saveStyles();

        // Compose our applied CSS
        $.extend(appliedLock, lockStyles, {
            // And apply scroll state as styles
            'left': -prevScroll.scrollLeft + 'px',
            'top': -prevScroll.scrollTop + 'px'
        });

        // Then lock styles...
        $html.css(appliedLock);

        // ...and scroll state
        $(window)
            .scrollLeft(0)
            .scrollTop(0);

        locked = true;
    }

    function unlock() {
        // Duplicate execution will break DOM statefulness
        if (!locked) {
            return;
        }

        // Revert styles
        $html.attr('style', $('<x>').css(prevStyles).attr('style') || '');

        // Revert scroll values
        $(window)
            .scrollLeft(prevScroll.scrollLeft)
            .scrollTop(prevScroll.scrollTop);

        locked = false;
    }

    return function scrollLock(on) {
        // If an argument is passed, lock or unlock depending on truthiness
        if (arguments.length) {
            if (on) {
                lock();
            } else {
                unlock();
            }
        }
        // Otherwise, toggle
        else {
            if (locked) {
                unlock();
            } else {
                lock();
            }
        }
    };
}());

var showModalMessage = false;

function absoluteHeader(position, posValue) {

    var header = $('.main-header');
    header.css({
        position: position,
        top: posValue
    });
}

$('.modal').on('show.bs.modal', function() {

    if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {

        var posValue = $(window).scrollTop() + "px";
        absoluteHeader('absolute', posValue);
    }

    $.scrollLock(true);
    var container = $(this);
    HideValidationMessages(container);
    container.find("input.form-control").val("");
});


$('.modal').on('hide.bs.modal', function() {

    if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {

        absoluteHeader('fixed', 0);
    }

    $.scrollLock(false);
});

function HideValidationMessages(container) {
    container.find(".vaildation-message").each(function() {
        var validaionElement = $(this);
        validaionElement.text("");
        validaionElement.hide();
    });
}

function ShowValidationMessages(container, errors) {
    container.find(".vaildation-message").each(function() {
        var validaionElement = $(this);
        var validationField = validaionElement.attr("for");

        if (errors.hasOwnProperty(validationField)) {
            validaionElement.html(errors[validationField]);
            validaionElement.show();
        } else {
            validaionElement.html("");
            validaionElement.hide();
        }
    });
}

function ShowModalMessage(header, text) {
    var container = $("#modal-message");
    container.find("#modal-title").text(header);
    container.find("#modal-text").text(text);
    container.modal("show");
}

function ConstructSubmitData(form) {
    var data = form.serializeArray();

    // add orderCode
    var orderCode = $("#OrderCode").val();
    data.push({ name: "OrderCode", value: orderCode });

    // clear non-digits from phone
    for (var index = 0; index < data.length; ++index) {
        if (data[index].name === "Phone") {
            data[index].value = ClearPhone(data[index].value);
            break;
        }
    }

    return data;
}

function ClearPhone(phoneNumber) {
    return phoneNumber.replace("+7", "").replace(/\D/g, "");
}

function ResetForm(form) {
    form[0].reset();
}

function SendAppointmentRequest(appointmentContainer, isModal) {
    var ajaxFunction = function(data) {

        if (data.Errors !== null && !$.isEmptyObject(data.Errors)) {
            ShowValidationMessages(appointmentContainer, data.Errors);
        } else {
            showModalMessage = true;
            HideValidationMessages(appointmentContainer);

            if (isModal) {
                $("#appointment").on('hidden.bs.modal', function(e) {
                    if (showModalMessage === true) {
                        ShowModalMessage(data.Header, data.Text);
                    }
                });
                $("#appointment").modal('hide');
            } else {
                ShowModalMessage(data.Header, data.Text);
            }

            ResetForm(appointmentContainer);
        }
    };

    var ajaxData = ConstructSubmitData(appointmentContainer);

    SendAjax("/GepaMed/SendAppointmentRequest", "POST", ajaxData, "json", ajaxFunction);
}

function SendConsultationRequest(consultationContainer) {
    var ajaxFunction = function(data) {
        if (data.Errors !== null && !$.isEmptyObject(data.Errors)) {
            ShowValidationMessages(consultationContainer, data.Errors);
        } else {
            showModalMessage = true;
            HideValidationMessages(consultationContainer);

            consultationContainer.on('hidden.bs.modal', function(e) {
                if (showModalMessage === true) {
                    ShowModalMessage(data.Header, data.Text);
                }
            });
            consultationContainer.modal('hide');

            ResetForm(consultationContainer.find("form"));
        }
    };

    var ajaxData = ConstructSubmitData(consultationContainer.find("form"));

    SendAjax("/GepaMed/SendConsultationRequest", "POST", ajaxData, "json", ajaxFunction);
}

function SendOrderPackageRequest(orderPackageContainer) {
    var ajaxFunction = function(data) {
        if (data.Errors !== null && !$.isEmptyObject(data.Errors)) {
            ShowValidationMessages(orderPackageContainer, data.Errors);
        } else {
            showModalMessage = true;
            HideValidationMessages(orderPackageContainer);

            orderPackageContainer.on('hidden.bs.modal', function(e) {
                if (showModalMessage === true) {
                    ShowModalMessage(data.Header, data.Text);
                }
            });
            orderPackageContainer.modal('hide');

            ResetForm(orderPackageContainer.find("form"));
        }
    };

    var ajaxData = ConstructSubmitData(orderPackageContainer.find("form"));

    SendAjax("/GepaMed/SendOrderPackageRequest", "POST", ajaxData, "json", ajaxFunction);
}

function SendAjax(url, type, data, dataType, successFunction) {
    $.ajax({
        type: type,
        url: url,
        data: data,
        timeout: 300000,
        dataType: dataType,
        cache: false,
        success: successFunction,
        error: function(xhr, ajaxOptions, thrownError) {
            $(".modal").modal("hide");
            ShowModalMessage("Произошла ошибка", thrownError);
        }
    });
}

// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

function preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault)
        e.preventDefault();
    e.returnValue = false;
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

$('#modal-message').on('hidden.bs.modal', function() {
    showModalMessage = false;
});

$('.gepalink').click(function() {
    $('html, body').stop().animate({
        scrollTop: 0
    }, 800);
});

$(function() {

    var content = [
        '<a href="http://helix.ru/catalog/item/40-063" target="_blank">' +
        '[40-063] Клинический и биохимический анализ крови - основные показатели</a><br>' +
        '<a href="http://helix.ru/catalog/item/09-012" target="_blank">' +
        '[09-012] HCV, РНК количественно [реал-тайм ПЦР]</a><br>' +
        '<a href=" 	http://helix.ru/catalog/item/07-010" target="_blank">' +
        '[07-010] Антитела к структурным и неструктурным белкам вируса гепатита С</a><br>' +
        '<a href="http://helix.ru/catalog/item/09-010" target="_blank">' +
        '[09-010] HCV, генотипирование, РНК [реал-тайм ПЦР]</a>'
    ].join('');

    $('.card__result-price-wrapper').webuiPopover({
        closeable: true,
        content: content,
        placement: 'top',
        animation: 'pop'
    });
});

var trData = $('.packages-content__row');
var trTarget = trData.filter(function(item) {
    return item % 2 == 1;
});

trTarget.addClass('packages-content--white');

var trExpTarget = $(".packages-content--white").nextUntil(".packages-content__row");
trExpTarget.addClass('packages-content--white');