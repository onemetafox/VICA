/* eslint global-require: 0 */ // --> OFF

module.exports = {
  content: [
    './node_modules/flowbite-react/**/*.js',
    './src/**/*.{js,ts,jsx,tsx}',
    './public/**/*.html',
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: "'Poppins',san-serif",
        poppinsLarge: "'Poppins-large',sans-serif",
        openSans: "'Open Sans',sans-serif",
      },
      colors: {
        darkGray: '#859AB5',
        dmGray: 'rgb(210,220,232)',
        mediumGray: '#ECF1F7',
        lightGray: '#F7F8FA',
        darkBlack: '#1E2329',
        lightBlack: '#474D57',
      },
      boxShadow: {
        inner: 'rgb(210 220 232) 0px -2px 34px inset',
        innerHover: 'rgb(190 206 225) 0px -2px 34px inset',
      },
      screens: {
        '2xl': { max: '1535px' },
        xl: { max: '1359px' },
        lg: { max: '1110px' },
        ed: { max: '876px' },
        md: { max: '877px' },
        asm: { max: '530px' },
        sm: { max: '530px' },
        axs: { max: '326px' },
      },
      keyframes: {
        fadeInOut: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        fadeOutIn: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
        translateIn: {
          '0%': { right: '-22rem' },
          '100%': { right: '0' },
        },
        translateOut: {
          '0%': { right: '0' },
          '100%': { right: '-22rem' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-15deg)' },
          '50%': { transform: 'rotate(15deg)' },
        },
        heartBeat: {
          '0%': { transform: 'scale(1);' },
          '14%': { transform: 'scale(1.3);' },
          '28%': { transform: 'scale(1);' },
          '42%': { transform: 'scale(1.3);' },
          '70%': { transform: 'scale(1);' },
        },
        flipHorizontal: {
          '50%': { transform: 'rotateY(180deg)' },
        },
        flipVertical: {
          '50%': { transform: 'rotateX(180deg)' },
        },
        swing: {
          '20%': {
            transform: 'rotate3d(0, 0, 1, 15deg)',
          },

          '40%': {
            transform: 'rotate3d(0, 0, 1, -10deg)',
          },

          '60%': {
            transform: 'rotate3d(0, 0, 1, 5deg)',
          },

          '80%': {
            transform: 'rotate3d(0, 0, 1, -5deg)',
          },
          to: {
            transform: 'rotate3d(0, 0, 1, 0deg)',
          },
        },
        rubberBand: {
          from: {
            transform: 'scale3d(1, 1, 1)',
          },

          '30%': {
            transform: 'scale3d(1.25, 0.75, 1)',
          },

          '40%': {
            transform: 'scale3d(0.75, 1.25, 1)',
          },

          '50%': {
            transform: 'scale3d(1.15, 0.85, 1)',
          },

          '65%': {
            transform: 'scale3d(0.95, 1.05, 1)',
          },

          '75%': {
            transform: 'scale3d(1.05, 0.95, 1)',
          },
          to: {
            transform: 'scale3d(1, 1, 1)',
          },
        },
        flash: {
          '25%, 40%': { opacity: '0' },
          '50%': { opacity: '1' },
          '75%': { opacity: '0' },
        },
        headShake: {
          '0%': {
            transform: 'translateX(0)',
          },
          '6.5%': {
            transform: 'translateX(-6px) rotateY(-9deg)',
          },

          '18.5%': {
            transform: 'translateX(5px) rotateY(7deg)',
          },

          '31.5%': {
            transform: 'translateX(-3px) rotateY(-5deg)',
          },

          '43.5%': {
            transform: 'translateX(2px) rotateY(3deg)',
          },
          '50%': {
            transform: 'translateX(0)',
          },
        },
        wobble: {
          from: {
            transform: 'translate3d(0, 0, 0)',
          },

          '15%': {
            transform: 'translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg)',
          },

          '30%': {
            transform: 'translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg)',
          },

          '45%': {
            transform: 'translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg)',
          },

          '60%': {
            transform: 'translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg)',
          },

          '75%': {
            transform: 'translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg)',
          },

          to: {
            transform: 'translate3d(0, 0, 0)',
          },
        },
        jello: {
          'from, 11.1%,to': {
            transform: 'translate3d(0, 0, 0)',
          },

          '22.2%': {
            transform: 'skewX(-12.5deg) skewY(-12.5deg)',
          },

          '33.3%': {
            transform: 'skewX(6.25deg) skewY(6.25deg)',
          },

          '44.4%': {
            transform: 'skewX(-3.125deg) skewY(-3.125deg)',
          },

          '55.5%': {
            transform: 'skewX(1.5625deg) skewY(1.5625deg)',
          },

          '66.6%': {
            transform: 'skewX(-0.78125deg) skewY(-0.78125deg)',
          },

          '77.7%': {
            transform: 'skewX(0.390625deg) skewY(0.390625deg)',
          },

          '88.8%': {
            transform: 'skewX(-0.1953125deg) skewY(-0.1953125deg)',
          },
        },
      },
      animation: {
        fadeInOut: 'fadeInOut 0.6s ease-in-out',
        fadeOutIn: 'fadeOutIn 0.6s ease-in-out',
        translateIn: 'translateIn 0.6s ease-in-out',
        translateOut: 'translateOut 0.6s ease-in-out',
        wiggle: 'wiggle 1s ease-in-out infinite',
        heartBeat: 'heartBeat 1s infinite',
        hflip: 'flipHorizontal 2s infinite',
        vflip: 'flipVertical 2s infinite',
        swing: 'swing 2s ease-out infinite',
        rubberBand: 'rubberBand 1s infinite',
        flash: 'flash 2s infinite',
        headShake: 'headShake 2s infinite',
        wobble: 'wobble 1s infinite',
        jello: 'jello 2s infinite',
      },
    },
    backgroundImage: {
      'register-cover': "url('/blue_bg.svg')",
      'refresh-counter-icon':
        'conic-gradient(transparent 0deg, transparent var(--transparentDeg), #59b868 var(--transparentDeg), #59b868 360deg)',
    },
  },
  plugins: [require('flowbite/plugin')],
};
