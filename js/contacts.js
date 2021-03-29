$((function() {
    var globalContainer = $("body .container-fluid");
    (function() {
        var languageDropdown = $(".dropdown"), selectedDropdown = null;
        languageDropdown.on("show.bs.dropdown", (function() {
            selectedDropdown = $(this);
            var menu = selectedDropdown.find("#dropdownLanguageOpenedMenu");
            var position = menu.hasClass("full-width") ? {
                left: $(this).offset().left,
                top: $(this).offset().top + $(this).outerHeight(true),
                width: $(this).outerWidth(),
                maxWidth: $(this).outerWidth()
            } : {
                left: $(this).offset().left + $(this).outerWidth() / 2 - parseInt(globalContainer.css("marginLeft")),
                top: $(this).offset().top + $(this).outerHeight(true)
            };
            position.positon = "absolute";
            position.display = "block";
            globalContainer.append(menu.css(position).detach());
            $(window).scroll(setDefaultLanguageDropdownPosition);
            $(window).on("resize", setDefaultLanguageDropdownPosition);
        }));
        languageDropdown.on("hidden.bs.dropdown", setDefaultLanguageDropdownPosition);
        function setDefaultLanguageDropdownPosition() {
            $(window).off("resize", setDefaultLanguageDropdownPosition);
            $(window).off("scroll", setDefaultLanguageDropdownPosition);
            if (!selectedDropdown) return;
            selectedDropdown.append($("body .container-fluid > #dropdownLanguageOpenedMenu").css({
                position: false,
                left: false,
                top: false,
                display: "none"
            }).detach());
            selectedDropdown = null;
        }
    })();
    (function() {
        var header = $(".section .row.header"), headerSticky = false;
        $(window).scroll(checkScrollPosition);
        function checkScrollPosition() {
            if ($(this).scrollTop() > header.position().top + header.outerHeight() - parseInt(header.css("padding-bottom"))) {
                if (!headerSticky) {
                    header.addClass("sticky");
                    setDesktopHeaderWidth();
                    $(window).resize(setDesktopHeaderWidth);
                }
                headerSticky = true;
            } else if (headerSticky) {
                header.removeClass("sticky");
                headerSticky = false;
                $(window).off("resize", setDesktopHeaderWidth);
                setDesktopHeaderWidth(null, "auto");
            }
        }
        function setDesktopHeaderWidth(event, value) {
            header.find(".header-wrapper").css({
                width: value || header.outerWidth(),
                left: globalContainer.css("marginLeft")
            });
        }
    })();
    (function() {
        var parallaxBgs = $(".parallax");
        parallaxBgs.each((function() {
            $(this).data("data", {
                translateY: 0,
                section: $(this).closest(".section"),
                speed: .15,
                isBg: $(this).hasClass("background-pattern")
            });
        }));
        $(window).scroll((function() {
            parallaxBgs.each((function() {
                var $this = $(this);
                var itemData = $this.data("data");
                var section = itemData.section;
                var windowHeight = $(window).height();
                var scrollTop = $(window).scrollTop();
                var top = isNaN(parseInt($this.css("top"))) ? 0 : Math.min(0, parseInt($this.css("top")));
                var bottom = isNaN(parseInt($this.css("bottom"))) ? 0 : Math.min(0, parseInt($this.css("bottom")));
                var height = $this.outerHeight() + top + bottom;
                var offset = $this.offset().top - top - itemData.translateY;
                if (isNaN(height) || offset + height <= scrollTop || offset >= scrollTop + windowHeight) return;
                var translateY = Math.round((offset - scrollTop - windowHeight / 2 + height / 2) * itemData.speed);
                if (!itemData.isBg) if (offset + translateY + height >= section.offset().top + section.outerHeight(true)) translateY = section.offset().top + section.outerHeight(true) - offset - height; else if (offset + translateY < section.offset().top) translateY = section.offset().top - offset;
                itemData.translateY = translateY;
                $this.data("data", itemData);
                $this.css("transform", "translate3d(0, " + translateY + "px, 0)");
            }));
        }));
    })();
    (function() {
        const formsWrapper = $(".hbspt-form"), forms = formsWrapper.find("form");
        forms.on("submit", e => {
            e.preventDefault();
            $(e.target).closest(".hbspt-form").addClass("hbspt-form_submited");
        });
    })();
    (function() {
        var controls = $(".control-wrapper"), data = $(".data-wrapper"), controlsActiveIndex = controls.find("li").index(controls.find(".active")), dataActiveIndex = data.find("li").index(controls.find(".active"));
        if (dataActiveIndex < 0 || dataActiveIndex !== controlsActiveIndex) setDataActive(controlsActiveIndex);
        controls.find("li").click((function() {
            var index = controls.find("li").index($(this));
            if (index === controlsActiveIndex) return;
            controls.find(".active").removeClass("active");
            controlsActiveIndex = index;
            $(this).addClass("active");
            setDataActive(controlsActiveIndex);
        }));
        function setDataActive(index) {
            data.find(".active").removeClass("active");
            $(data.find("li").get(index)).addClass("active");
        }
    })();
}));