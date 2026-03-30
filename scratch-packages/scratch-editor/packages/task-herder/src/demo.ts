const app = document.querySelector<HTMLDivElement>('#app')
if (!app) throw new Error('Could not find app div!')
app.innerHTML = `
  <div>
    <h1>Task Herder</h1>
    <p>
      This will be a demo of the <code>task-herder</code> package.
    </p>
  </div>
`
