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
        var watchVideoModal = $("#watchVideoModal"), videoFrame = watchVideoModal.find(".modal-body iframe");
        $(".resources .resource.type-video .icon-link").click((function() {
            var src = $(this).data("video-src"), name = $(this).data("video-name");
            watchVideoModal.find(".modal-header .video-name").html(name);
            videoFrame.attr("src", src);
            watchVideoModal.modal("show");
        }));
        watchVideoModal.find(".close.icon-link").click((function() {
            videoFrame.attr("src", "");
            watchVideoModal.modal("hide");
        }));
    })();
    $(".header .try-it, #menuModal .try-it").click((function(event) {
        event.preventDefault();
        $("html, body").animate({
            scrollTop: $("#tryItForFree").offset().top
        }, "slow");
    }));
    (function() {
        var topButton = $(".section:nth-child(1) .top-button");
        if (topButton) topButton.find(".close-icon").click((function() {
            topButton.removeClass("enabled");
        }));
    })();
    (function() {
        $(".section:nth-child(1) .next-section-button").click((function() {
            var cls = $(this).closest(".section").next().position().top;
            $("html, body").animate({
                scrollTop: cls
            }, "slow");
        }));
    })();
    (function() {
        var ROTATE_TOP_OFFSET = .7;
        var VIDEO_START_OFFSET = .25;
        var mockup = $(".section:nth-child(1) .mockup"), videoRotateContainer = mockup.find(".video-rotate-container"), video = videoRotateContainer.find(".video-wrapper video").get(0);
        var height = 0, windowHeight = 0, scrollTop = 0;
        var videoPlayed = false;
        function sectionFirstPositionHandler() {
            windowHeight = $(window).height();
            scrollTop = $(this).scrollTop();
            if (!videoPlayed && windowHeight + scrollTop > videoRotateContainer.offset().top + videoRotateContainer.height() * VIDEO_START_OFFSET) {
                video.play();
                videoPlayed = true;
            }
            if ("none" !== mockup.css("perspective")) {
                height = mockup.height() * ROTATE_TOP_OFFSET;
                if (windowHeight + scrollTop < mockup.offset().top + height) {
                    videoRotateContainer.addClass("rotated");
                    return;
                }
            }
            videoRotateContainer.removeClass("rotated");
        }
        sectionFirstPositionHandler();
        $(window).on("scroll resize", sectionFirstPositionHandler);
        mockup.removeClass("disabled");
    })();
    (function() {
        var ANIMATION_DURATION = 1200;
        var productsSelectItems, animationInProcess, section2 = $(".section:nth-child(2)"), productsWrapper = section2.find(".products-wrapper"), productsSelect = productsWrapper.find(".product-select"), products = productsWrapper.find(".product"), videos = productsWrapper.find(".product video"), productNextButtons = productsWrapper.find(".next-product-button"), productActive = productsWrapper.find(".product.active"), activeIndex = products.index(productActive);
        function productsFocusHandler() {
            if ($(window).height() + $(this).scrollTop() > section2.position().top + section2.height() / 2) {
                productOnFocus();
                $(window).off("scroll", productsFocusHandler);
            }
        }
        function productsChangeHandlers() {
            $(window).scroll(productsFocusHandler);
            productNextButtons.click(toNextProduct);
            videos.on("ended", toNextProduct);
            productsSelectItems = [];
            products.each((function(index) {
                productsSelectItems.push('<div class="' + (index == activeIndex ? "active" : "") + '"></div>');
            }));
            productsSelect.html(productsSelectItems.join(""));
            productsSelectItems = productsSelect.find("div");
            productsSelectItems.click((function() {
                var currentIndex = productsSelectItems.index(this);
                if (currentIndex === activeIndex) return;
                changeActiveProduct(products.eq(currentIndex), currentIndex);
            }));
        }
        function toNextProduct() {
            var product, index;
            if (productActive.next().length) {
                product = productActive.next();
                index = activeIndex + 1;
            } else {
                product = products.first();
                index = 0;
            }
            changeActiveProduct(product, index);
        }
        function changeActiveProduct(newActive, newIndex) {
            if (animationInProcess) return;
            productActive.find("video").get(0).pause();
            productActive.addClass("fade-out");
            newActive.addClass("active fade-in next-item");
            animationInProcess = true;
            setTimeout((function() {
                productActive.removeClass("fade-out active");
                productActive.find("video").get(0).currentTime = 0;
                newActive.removeClass("fade-in next-item");
                productActive = newActive;
                productActive.find("video").get(0).play();
                animationInProcess = false;
            }), ANIMATION_DURATION);
            productsSelectItems.eq(activeIndex).removeClass("active");
            productsSelectItems.eq(newIndex).addClass("active");
            activeIndex = newIndex;
        }
        function productOnFocus() {
            productActive.removeClass("hidden-on-start");
            productActive.addClass("fade-in");
            animationInProcess = true;
            setTimeout((function() {
                productActive.removeClass("fade-in");
                productActive.find("video").get(0).play();
                animationInProcess = false;
            }), ANIMATION_DURATION);
        }
        productsChangeHandlers();
    })();
    (function() {
        var DELAY_BETWEEN_GRAPH_GROW = 200;
        var GRAPH_ANIMATION_DURATION = 1e3;
        var statisticGraphs = $(".statistic-graph-wrapper .graphs .graph"), statisticValues = $(".statistics-numbers .number .percents").map((function() {
            var item = $(this), value = item.html();
            $(this).html(0);
            return {
                el: item,
                val: value
            };
        })), section3 = $(".section:nth-child(3)");
        function startAnimation() {
            $(window).on("resize", setGraphRoundedSizes);
            setGraphRoundedSizes();
            statisticGraphs.each((function(index, item) {
                setTimeout(function(index, item) {
                    $(item).css("maxHeight", statisticValues[index].val + "%");
                }.bind(null, index, item), index * DELAY_BETWEEN_GRAPH_GROW);
                animate({
                    duration: GRAPH_ANIMATION_DURATION,
                    timing: function(timeFraction) {
                        return timeFraction;
                    },
                    callback: function(el, val, progress) {
                        $(el).html(Math.max(0, Math.round(progress * val)));
                    }.bind(null, statisticValues[index].el, statisticValues[index].val)
                });
            }));
            function setGraphRoundedSizes() {
                statisticGraphs.each((function(index, item) {
                    $(item).find(".side").css({
                        width: parseInt($(item).outerWidth()) + "px"
                    });
                }));
            }
            function animate(options) {
                var start = performance.now();
                requestAnimationFrame((function animate(time) {
                    var timeFraction = Math.min((time - start) / options.duration, 1);
                    var progress = options.timing(timeFraction);
                    options.callback(progress);
                    if (timeFraction < 1) requestAnimationFrame(animate);
                }));
            }
        }
        function statisticsFocusHandler() {
            if ($(window).height() + $(this).scrollTop() > section3.position().top + section3.height() / 2) {
                startAnimation();
                $(window).off("scroll", statisticsFocusHandler);
            }
        }
        $(window).on("scroll", statisticsFocusHandler);
    })();
    (function() {
        var TRANSITION_DURATION = 1e3;
        var section4 = $(".section:nth-child(4)"), carouselSocial = section4.find(".carousel.social"), carouselItems = carouselSocial.find(".carousel-inner.mobile .item"), carouselInnerDesktop = carouselSocial.find(".carousel-inner.desktop");
        var carouselIndicators = [];
        var animationStarted = false;
        carouselItems.each((function(index, item) {
            carouselIndicators.push('<li data-target="#socialCarousel" class="' + ($(item).hasClass("active") ? "active" : "") + '" data-slide-to="' + index + '"></li>');
        }));
        carouselSocial.find(".carousel-indicators").html(carouselIndicators);
        var items = carouselSocial.find(".carousel-inner.desktop").html(carouselItems.clone()), itemsLength = carouselItems.length, arrows = carouselSocial.find(".carousel-arrows .arrow"), tempChild = null, firstChild = null, lastChild = null;
        firstChild = items.find(".item:first-child").clone();
        lastChild = items.find(".item:last-child").clone();
        lastChild.prependTo(items);
        firstChild.appendTo(items);
        setTimeout((function() {
            items.removeClass("disabled");
        }), TRANSITION_DURATION);
        arrows.click(slideSocialCarouselDesktop);
        carouselSocial.on("swipeleft", (function() {
            $(this).carousel("next");
        }));
        carouselSocial.on("swiperight", (function() {
            $(this).carousel("prev");
        }));
        function slideSocialCarouselDesktop() {
            if (animationStarted) return;
            animationStarted = true;
            if ($(this).hasClass("left")) {
                lastChild = items.find(".item:last-child");
                tempChild = items.find(".item:nth-of-type(" + itemsLength + ")");
                lastChild.remove();
                tempChild.clone().prependTo(items);
            } else {
                firstChild = items.find(".item:first-child");
                tempChild = items.find(".item:nth-of-type(3)").clone();
                tempChild.appendTo(items);
                firstChild.remove();
            }
            setTimeout((function() {
                animationStarted = false;
            }), TRANSITION_DURATION);
        }
        $(window).on("scroll", socialCarouselFocusHandler);
        function socialCarouselFocusHandler() {
            if ($(window).height() + $(this).scrollTop() > section4.position().top && $(window).height() + $(this).scrollTop() < section4.position().top + section4.outerHeight()) {
                if (!carouselInnerDesktop.hasClass("focused")) carouselInnerDesktop.addClass("focused");
            } else if (carouselInnerDesktop.hasClass("focused")) carouselInnerDesktop.removeClass("focused");
        }
    })();
    (function() {
        var RESOURCE_ANIMATION_DURATION = 600;
        var RESOURCE_ANIMATION_FADE_OUT_DURATION = 500;
        var resourcesCarousel = $(".resources-wrapper.carousel"), resourcesInner = resourcesCarousel.find(".carousel-inner"), resources = $(".resources-wrapper:not(.carousel) .resources .resource"), arrowsWrapper = resourcesCarousel.find(".carousel-arrows");
        resourcesInner.append(resources.clone(true));
        if (resources.length < 4) return;
        arrowsWrapper.removeClass("hidden");
        var margin, offset, animationStarted = false, firstChild = null, fadeChild = null;
        if (resourcesCarousel.is(":hidden")) $(window).on("resize", checkResourcesState); else setDefault();
        function checkResourcesState() {
            if (!resourcesCarousel.is(":hidden")) {
                $(window).off("resize", checkResourcesState);
                setDefault();
            }
        }
        function setDefault() {
            margin = parseInt(resources.first().css("marginLeft"));
            offset = -resources.first().outerWidth(true);
            resourcesInner.prepend(resources.last().clone(true).css("marginLeft", offset));
        }
        arrowsWrapper.find(".arrow").click((function() {
            if (animationStarted) return;
            animationStarted = true;
            firstChild = resourcesInner.find(".resource:first-child");
            if ($(this).hasClass("left")) {
                fadeChild = resourcesInner.find(".resource:nth-child(4)");
                resourcesInner.find(".resource:last-child").remove();
                firstChild.animate({
                    marginLeft: 0
                }, {
                    duration: RESOURCE_ANIMATION_DURATION,
                    queue: false,
                    complete: function() {
                        animationStarted = false;
                        firstChild.css("marginLeft", margin);
                        fadeChild.css("opacity", 1);
                        resourcesInner.prepend(resourcesInner.find(".resource:last-child").clone(true).css("marginLeft", offset));
                    }
                });
            } else {
                fadeChild = resourcesInner.find(".resource:nth-child(2)");
                firstChild.animate({
                    marginLeft: 2 * offset
                }, RESOURCE_ANIMATION_DURATION, (function() {
                    animationStarted = false;
                    resourcesInner.find(".resource:nth-child(2)").css("marginLeft", offset);
                    firstChild.remove();
                    fadeChild.css("opacity", 1);
                    resourcesInner.append(resourcesInner.find(".resource:first-child").clone(true).css("marginLeft", margin));
                }));
            }
            fadeChild.animate({
                opacity: 0
            }, {
                duration: RESOURCE_ANIMATION_FADE_OUT_DURATION,
                queue: false
            });
        }));
    })();
    (function() {
        var carousel = $(".partners-wrapper .owl-carousel"), itemsLength = carousel.children().length;
        $(".owl-carousel").owlCarousel({
            loop: false,
            dots: false,
            nav: false,
            lazyLoad: true,
            autoplay: true,
            autoplayTimeout: 3e3,
            autoplayHoverPause: true,
            responsiveClass: true,
            responsive: {
                0: {
                    items: 1,
                    loop: itemsLength > 1
                },
                378: {
                    items: 2,
                    loop: itemsLength > 2
                },
                480: {
                    items: 3,
                    loop: itemsLength > 3
                },
                768: {
                    items: 4,
                    loop: itemsLength > 4
                },
                978: {
                    items: 5,
                    loop: itemsLength > 5
                }
            }
        });
    })();
}));