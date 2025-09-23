### nav container
```html
<div class="nav-container">
            <div class="list-item website-title">
                <h1>Arthur&nbsp;Vergani</h1>
            </div>
            <div class="menu">
                <div class="list-item item">
                    <p>Work</p>
                </div>
                <div class="list-item item">
                    <p>About</p>
                </div>
                <div class="list-item item">
                    <p>Contact</p>
                </div>
            </div>
        </div>
```

```css
    .nav-container {
    position: fixed;
    top: 24px;
    left: 400px;
    display: inline-flex;
    flex-direction: column;
    width: auto;
}

.list-item {
    display: inline-flex;
    width: auto;
    padding: 4px;
}

.list-item.website-title {
    color: var(--on-tertiary-container);
    background-color: var(--tertiary);
}

.list-item.item {
    background-color: var(--surface-high);
}

.list-item h1 {
    margin: 0px;
    font-weight: 500;
    font-size: 20px;
}

.list-item p {
    margin: 0px;
    font-size: 20px;
    width: auto;
}

.menu {
    display: inline-flex;
    flex-direction: column;
    width: auto;
}

```