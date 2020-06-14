<template lang="pug">
  .toggle
    input#cb3.tgl.tgl-skewed(type="checkbox" :checked="checked" @change="emitChange")
    label.tgl-btn(data-tg-off="OFF" data-tg-on="ON" for="cb3")
</template>

<script>
export default {
  name: 'Toggle',
  props: ['value'],
  data () {
    return {
      checked: this.value
    }
  },
  methods: {
    emitChange () {
      this.checked = !this.checked
      this.$emit('input', this.checked)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
.toggle
  font-family 'Dosis', sans-serif

.tgl {
  display: none;

  // add default box-sizing for this scope
  &,
  &:after,
  &:before,
  & *,
  & *:after,
  & *:before,
  & + .tgl-btn {
    box-sizing: border-box;
    &::selection {
      background: none;
    }
  }

  + .tgl-btn {
    outline: 0;
    display: block;
    width: 2.5em;
    height: 1.6em;
    position: relative;
    cursor: pointer;
    user-select: none;
    &:after,
    &:before {
      position: relative;
      display: block;
      content: "";
      width: 50%;
      height: 100%;
    }

    &:after {
      left: 0;
    }

    &:before {
      display: none;
    }
  }

  &:checked + .tgl-btn:after {
    left: 50%;
  }
}

// themes
.tgl-skewed {
  + .tgl-btn {
    overflow: hidden;
    // transform: skew(-10deg);
    backface-visibility: hidden;
    transition: all .2s ease;
    font-family 'Dosis', sans-serif
    background: $beet_lt;
    border-radius 30px
    &:after,
    &:before {
      // transform: skew(10deg);
      display: inline-block;
      transition: all .2s ease;
      width: 100%;
      text-align: center;
      position: absolute;
      line-height: 1.7em;
      font-weight: bold;
      color: #fff;
      text-shadow: 0 1px 0 rgba(0,0,0,.4);
    }

    &:after {
      left: 100%;
      content: attr(data-tg-on);
      font-size: 0.9rem
    }

    &:before {
      left: 0;
      font-size: 0.9rem
      content: attr(data-tg-off);
    }

    &:active {
      background: $beet_lt;
      &:before {
        left: -10%;
      }
    }
  }

  &:checked + .tgl-btn {
    background: $green_extra_dk;
    &:before {
      left: -100%;
    }

    &:after {
      left: 0;
    }

    &:active:after {
      left: 10%;
    }
  }
}

</style>
