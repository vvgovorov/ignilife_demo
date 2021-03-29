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
        try {
            var sliderData = JSON.parse(window.sliderData);
        } catch (e) {
            void 0;
        }
        var pricingSlider = $("#pricing"), pricingWrapper = $(".pricing-wrapper"), sliderMaxValue = pricingWrapper.find(".slider-max-value"), usersCount = pricingWrapper.find(".users-count"), price = pricingWrapper.find(".price-wrapper.per-user .price .value .count"), pricePerMonth = pricingWrapper.find(".price-wrapper.total .price.month .value .count"), pricePerYear = pricingWrapper.find(".price-wrapper.total .price.year .value .count"), savedMoneyWrapper = pricingWrapper.find(".price-wrapper.total .price.saved .value .count"), optionsWrapper = pricingWrapper.find(".options"), payType = pricingWrapper.find(".pay-type"), payTypeItems = payType.find(".item");
        var max = sliderData[sliderData.length - 1].limit, discount = 1 - payType.find(".item.annually .value").html() / 100, discountCurrent = 1, currentUsersCount = 100;
        pricingSlider.slider({
            range: "min",
            max,
            min: 1,
            step: 1,
            value: currentUsersCount,
            slide: function(event, ui) {
                currentUsersCount = ui.value;
                createHtml(currentUsersCount);
            }
        });
        usersCount.on("keypress", (function(e) {
            if (13 === e.which) {
                $(this).blur();
                $(this).trigger("change");
                return false;
            }
            return e.metaKey || e.which <= 0 || 8 == e.which || /[0-9]/.test(String.fromCharCode(e.which));
        }));
        usersCount.on("input", (function() {
            var $this = $(this);
            var val = parseInt($this.val());
            val = isNaN(val) ? 1 : val;
            $(this).val(Math.min(max, Math.max(1, val)));
        }));
        usersCount.on("change, blur", (function() {
            var newValue = +$(this).val();
            if (newValue !== currentUsersCount) setNewUsersCount(newValue);
        }));
        sliderMaxValue.click((function() {
            setNewUsersCount(max);
        }));
        payTypeItems.click((function() {
            var $this = $(this);
            if ($this.hasClass("active")) return;
            if ($this.hasClass("annually")) {
                discountCurrent = discount;
                pricingWrapper.addClass("annually");
            } else {
                discountCurrent = 1;
                pricingWrapper.removeClass("annually");
            }
            payType.find(".item.active").removeClass("active");
            $this.addClass("active");
            createHtml(currentUsersCount);
        }));
        function createHtml(value) {
            var index = 0;
            sliderData.every((function(item, i) {
                if (value <= item.limit) {
                    index = i;
                    return false;
                }
                return true;
            }));
            var options = sliderData[index].options.map((function(item) {
                return '<div class="option"><span class="icon"></span><span class="text">' + item + "</span></div>";
            }));
            var monthPrice = Math.round(value * parseFloat(sliderData[index].price.replace(/,/g, "."))), yearPrice = Math.round(12 * monthPrice * discountCurrent), savedMoney = Math.round(12 * monthPrice * (1 - discountCurrent));
            usersCount.val(value);
            price.html(sliderData[index].price);
            pricePerMonth.html(monthPrice);
            pricePerYear.html(yearPrice);
            savedMoneyWrapper.html(savedMoney);
            optionsWrapper.html(options.length ? options.join("") : "&nbsp;");
            pricingWrapper.find(".currency").html(sliderData[index].currency);
            if (value == max) {
                if (!pricingWrapper.hasClass("max-value")) pricingWrapper.addClass("max-value");
            } else if (pricingWrapper.hasClass("max-value")) pricingWrapper.removeClass("max-value");
        }
        function setNewUsersCount(value) {
            currentUsersCount = value;
            createHtml(currentUsersCount);
            pricingSlider.slider("value", currentUsersCount);
        }
        createHtml(currentUsersCount);
    })();
}));