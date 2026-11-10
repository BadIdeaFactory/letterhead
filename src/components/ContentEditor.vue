<template>
  <div class="editor" :class="{ visible: isActive }">
    <div class="dialog">
      <h2>Content editor</h2>
      <p>Use <a href="https://www.markdownguide.org/basic-syntax" target="_blank" rel="noopener noreferer">Markdown syntax</a> to write text.</p>
      <div class="body">
        <textarea
          v-model="editedContent"
          aria-label="Markdown content"
          rows="20"
        />
      </div>
      <div class="controls">
        <button @click="handleCancel">Cancel</button>
        <button @click="handleConfirm">Confirm</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isActive: {
      default: false,
      type: Boolean
    },
    content: {
      default: '',
      type: String
    }
  },
  data() {
    return {
      editedContent: this.content
    }
  },
  methods: {
    handleCancel: function () {
      this.$emit('update:isEditorActive', false)
    },
    handleConfirm: function () {
      this.$emit('update:content', this.editedContent)
      this.$emit('update:isEditorActive', false)
    },
  }
}
</script>

<style scoped>
.editor {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.35);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  display: none;
  z-index: 2;
  color: black;
}

.editor.visible {
  display: flex;
}

.dialog {
  background-color: white;
  -webkit-box-shadow: 0 0 6px rgba(0, 0, 0, 0.15);
  -moz-box-shadow: 0 0 6px rgba(0, 0, 0, 0.15);
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.15);
  width: 100%;
  margin: 20px;
  max-width: 600px;
  max-height: 800px;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 1em 2em;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.dialog p {
  margin-top: 0;
  line-height: 1.4;
}

.controls {
  margin-top: 2em;
  text-align: center;
}

.body {
  flex-grow: 1;
}

textarea {
  width: 100%;
  height: 500px;
  resize: vertical;
  font: inherit;
  box-shadow: none;
  border: 1px solid #ddd;
}

button {
  color: #333;
  border: 1px solid #333;
}
</style>

