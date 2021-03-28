let progData;
const numberOfSlices = 8;
const main = document.getElementById('home');
const logo = document.getElementById('logo');
const overlay = document.querySelector('.overlay');
const loadingMsg = document.getElementById('status');
const btnUp = document.getElementById('up');
const btnDown = document.getElementById('down');
const btnLeft = document.getElementById('left');
const btnRight = document.getElementById('right');
const btnBack = document.getElementById('back');
const btnOk = document.getElementById('ok');
let focusableElements,
    links,
    buttons,
    heroContentWrap;
let renderedSlices = 0;

// Include random data failure
randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

// Remote control indicator
highlighBtn = (ref) => {
    ref.classList.add('highlight');
    setTimeout(function(){
        ref.classList.remove('highlight');
    },500);
};

getAllElements = () => {
    focusableElements = document.querySelectorAll('button,a');
    links = document.querySelectorAll('a');
    buttons = document.querySelectorAll('button');
    heroContentWrap = document.querySelector('.hero-content');
};

// Element builder
buildElement = (tag, content, ariaLabel, bg, elId, elClassName) => {

    const el = document.createElement(tag);
    if( bg ){
        el.style.backgroundImage = `url(${bg})`;
    }
    if( content ){
        el.textContent = content;
    }
    if( ariaLabel ){
        el.setAttribute('aria-label',ariaLabel);
    }
    if( elId ){
        el.id = elId;
    }
    if( elClassName ){
        el.className = elClassName;
    }
    return el;
};

// Hero content updater
setHeroContent = (heroData) => {
    heroTitle.textContent = heroData.title;
    heroDesc.textContent = heroData.summary;
    main.style.backgroundImage = `url(${heroData.brand.images[0].href})`;
};

// Build hero content elements
heroContent = (heroData) => {
    const hero = document.createElement('article');
    hero.className = 'hero-content';
    hero.appendChild(buildElement('h2',heroData.title,null,null,'heroTitle'));
    hero.appendChild(buildElement('p','New on All4',null,null,'heroSubtitle','subtitle'));
    hero.appendChild(buildElement('p',heroData.secondaryTitle,null,null,'heroDesc'));
    heroWrap.appendChild(hero);
    setHeroContent(heroData);
};

// Build programme carousel
buildProgList = (progData) => {
    

    let currentNumberOfSlices = document.querySelectorAll('article').length;
    //console.log(`APP: PROGRAMME LISTS BUILT - ${currentNumberOfSlices}`);

    if( currentNumberOfSlices < numberOfSlices ){
        console.log(`--- APP: BUILDING LIST ${currentNumberOfSlices}`);

        const slice = document.createElement('article');
        const sliceData = progData[currentNumberOfSlices];
        const sliceTitle = buildElement('h2',sliceData.title,null,null);
        slice.className = 'slice';
        slice.appendChild(sliceTitle);

        if( currentNumberOfSlices === 0 ){
            heroContent(sliceData.sliceItems[0]);
        } else {
            // LISTING
        }
        const sliceList = buildElement('ul',null,null,null);
        sliceData.sliceItems.forEach(function(data){
            const progWrap =  buildElement('li',null,null,null);
            const progTrigger = buildElement('button',null,data.title,data.image.href);
            
            // If button is in the first slice, update the ehero
            if( currentNumberOfSlices === 0 ){
                
                progTrigger.addEventListener('focus',function(){
                    setTimeout(function(){
                        setHeroContent(data);
                    },600);
                });
            }

            progWrap.appendChild(progTrigger);
            sliceList.appendChild(progWrap);
        });

        slice.appendChild(sliceList);
        main.appendChild(slice);
        
        buildProgList(progData);

    } else if( currentNumberOfSlices === numberOfSlices ){
        console.log('APP: ALL PROGRAMME LISTS BUILT');
        console.log('APP: GETTING ALL FOCUSABLE ELEMENTS');
        getAllElements();
        console.log('APP: HIDING LOADING PANEL');
        hideLoadingOverlay();
    }
};

// Simulate API 
getProgData = (dataUrl) => {
    fetch(dataUrl, { headers: { "Content-Type": "application/json; charset=utf-8" }})
        .then(res => res.json())
        .then(response => {
            console.log('APP: DATA RECEIVED');
            console.log(`APP: BUILDING ${numberOfSlices-1} PROGRAMME LISTS`);
            buildProgList(response.slices);
        })
        .catch(err => {
            loadingMsg.textContent = 'Cannot retrieve data...';
            return "NO DATA";
        });
};

// Loading animation in
const showLogo = () => {
    logo.classList = '';
    setTimeout(function(){
        logo.classList.add('in');
    },2000);
    setTimeout(function(){
        logo.classList.remove('in');
        logo.classList.add('loading');
        loadingMsg.textContent = 'Fetching data...';
        loadingMsg.style.opacity = 1;
    },5000);
};

// Loading animation out
const hideLoadingOverlay = () => {
    console.log('APP: HIDING OVERLAY');
    
    //const timeOut = randomNumber(6000,12000);
    const timeOut = 10000;
    setTimeout(function(){
        // Fade out status text
        loadingMsg.style.opacity = 0;

        // Run swipe
        overlay.classList.add('swipe');

        // Halfway through hide overlay
        setTimeout(function(){
            logo.style.opacity = 0;
            overlay.style.backgroundColor = 'rgba(0,0,0,0)'
        },700);

        console.log('APP: FOCUSING ON FIRST ANCHOR');
        document.querySelector('a').focus();
    
    },timeOut);
    
};



// BUILD MAIN MOVER



getIndex = (ref) => {
    let activeIndex = 0;
    ref.forEach(function(el, i){
        if( el === document.activeElement ){
            activeIndex = i;
        }
    });
    return activeIndex;
};


handleLink = (code) => {
    console.log('NAV: FOCUS ON LINK');
    main.style.transitionDuration = '0.2s';
    if( code === 40 ){
        links[getIndex(links)+1].focus();
    } else if( code === 38 ){
        links[getIndex(links)-1].focus();
    } else if( code === 39 ){
        // Go to hero
        buttons[0].focus();
    } else if( code === 37 ){
        // Close nav
        buttons[0].focus();
    } else if( code === 13 ){
        // Go to first button
        buttons[0].focus();
    } 
};

let activeRow = 0;
let moveAmount = 0;

handleButton = (code, el) => {
    console.log('NAV: FOCUS ON BUTTON');
    main.style.transitionDuration = 's';
    const elLi  = el.parentElement;
    const elUl = elLi.parentNode;
    const elUlLength = elUl.children.length - 1;
    const elWrap = elUl.parentElement;
    const index = Array.prototype.indexOf.call(elUl.children, elLi);
    const allUls = document.querySelectorAll('main ul');

    if( code === 39 || code === 37 ){
        console.log('NAV: EITHER LEFT OR RIGHT');
        let currentXAttr = window.getComputedStyle(elUl,null).getPropertyValue('left');
        currentX = currentXAttr.split('px');
        const pxIntoVw = Number((currentX[0] / 1600)*100);
        if( code === 37 ){
            // RIGHT - PREV
            if( index > 0 ){
                heroContentWrap.classList.add('in');
                elUl.style.left = `${ pxIntoVw + 17.7 }vw`;
                buttons[getIndex(buttons)-1].focus();
                setTimeout(function(){
                    heroContentWrap.classList.remove('in');
                },1200);
            }
        } else if( code === 39){
            // LEFT - NEXT
            if( index < elUlLength ){
                heroContentWrap.classList.add('out');
                elUl.style.left = `${ pxIntoVw - 17.7 }vw`;
                buttons[getIndex(buttons)+1].focus();
                setTimeout(function(){
                    heroContentWrap.classList.remove('out');
                },1200);
            }

        }
    } else if( code === 40 || code === 38 ){
        console.log('NAV: EITHER UP OR DOWN');
        if( code === 38 ){
            console.log('NAV: UP');
            if( activeRow !== 0 ){
                if( activeRow > 1 ){
                    moveAmount = moveAmount - 15.5;
                } else if(activeRow === 1 ){
                    moveAmount = 0;
                }
                main.style.transform = `translateY(-${moveAmount}vw)`;
                activeRow --;
                
            }
            
        } else if( code === 40 ){
            console.log('NAV: DOWN');
            if( activeRow !== 0 ){
                moveAmount = moveAmount + 15.5;
            } else if( activeRow === 0 ){
                moveAmount = 47;
            }
            main.style.transform = `translateY(-${moveAmount}vw)`;
            activeRow ++;
        }
        console.log(`NAV: ACTIVE ROW = ${activeRow}`);
        allUls[activeRow].querySelectorAll('button')[0].focus();
    }
    

    // const elLi  = el.parentElement;
    // const elUl = elLi.parentNode;
    // const elUlLength = elUl.children.length - 1;
    // const elWrap = elUl.parentElement;
    // const index = Array.prototype.indexOf.call(elUl.children, elLi);
    
    // if( code === 39 || code === 37 ){
    //     let currentXAttr = window.getComputedStyle(elUl,null).getPropertyValue('left');
    //     currentX = currentXAttr.split('px');
    //     const pxIntoVw = Number((currentX[0] / 1600)*100);
        
    //     if( code === 37 ){
    //         // RIGHT - PREV
    //         if( index > 0 ){
    //             heroContentWrap.classList.add('in');
    //             elUl.style.left = `${ pxIntoVw + 17.7 }vw`;
    //             buttons[getIndex(buttons)-1].focus();
    //             setTimeout(function(){
    //                 heroContentWrap.classList.remove('in');
    //             },1200);
    //         }
    //     } else if( code === 39){
    //         // LEFT - NEXT
    //         if( index < elUlLength ){
    //             heroContentWrap.classList.add('out');
    //             elUl.style.left = `${ pxIntoVw - 17.7 }vw`;
    //             buttons[getIndex(buttons)+1].focus();
    //             setTimeout(function(){
    //                 heroContentWrap.classList.remove('out');
    //             },1200);
    //         }

    //     }
        
    // } else if( code === 40 || code === 38 ){
        
    //     const elLi  = el.parentElement;
    //     const elUl = elLi.parentNode;
    //     const index = Array.prototype.indexOf.call(elUl.children, elLi);
    //     if( code === 40 ){
    //         elUl.parentElement.nextElementSibling.childNodes[1].childNodes[index].childNodes[0].focus();
    //         if( activeRow === 0 ){
    //             main.style.transform = 'translate3d(0,-50vw,0)';
    //             activeRow = 1;
    //         } else {
    //             activeRow ++;
    //             const moveAmount = 50 + (13.5 * activeRow );
    //             main.style.transform = `translate3d(0,-${moveAmount}vw,0)`;
    //         }
    //     } else if( code === 38 ){
    //         elUl.parentElement.previousElementSibling.childNodes[1].childNodes[index].childNodes[0].focus();
    //         if( activeRow === 1 ){
    //             main.style.transform = 'translate3d(0,0,0)';
    //             activeRow = 0;
    //         } else {
    //             activeRow --;
    //             const moveAmount = 50 - (13.5 * activeRow );
    //             main.style.transform = `translate3d(0,-${moveAmount}vw,0)`;
    //         }
    //     }
        
    // }
};


// Simulate remote inputs
document.addEventListener('keydown',function(evt){
  
    const el = document.activeElement;

    moveFocus = (code, el) => {
        // Define actions based on active element
        if( el.tagName === 'A' ){
            handleLink(code);
        } else if( el.tagName === 'BUTTON' ){
            handleButton(code, el);
        }
    };
        
    // Key codes needed
    if( evt.keyCode === 39 ){
        console.log('NAV: RIGHT');
        highlighBtn(btnRight);
    } else if( evt.keyCode === 37 ){
        console.log('NAV: LEFT');
        highlighBtn(btnLeft);
    } else if( evt.keyCode === 38 ){
        console.log('NAV: UP');
        highlighBtn(btnUp);
    } else if( evt.keyCode === 40 ){
        console.log('NAV: DOWN');
        highlighBtn(btnDown);
    } else if( evt.keyCode === 13 ){
        console.log('NAV: OK');
        highlighBtn(btnOk);
    } else if( evt.keyCode === 8 ){
        console.log('NAV: HOME'); 
        highlighBtn(btnBack);
        focusableElements[0].focus();
    } else {
        evt.preventDefault();
    }

    moveFocus(evt.keyCode, el);
});

// Spin up app
initApp = () => {
    console.log('APP: SHOWING LOADING PANEL');
    showLogo();
    console.log('APP: GETTING DATA');
    getProgData('data.json');
};

window.onload = () => {
    console.log('APP: JS RUNNING');
    initApp();
};























// Screen swipe?