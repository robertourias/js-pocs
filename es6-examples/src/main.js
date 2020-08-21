import 'regenerator-runtime/runtime';
import api from './api';

/**
 *
 * Recurso de classe
 * 
 */
class App {
    constructor() {
        
        this.repositories = [];

        this.formElement = document.getElementById("repo-form");
        this.inputElement = document.querySelector("input[name=repository]");
        this.listElement = document.getElementById("repo-list");
        console.log("App -> constructor -> this.listElement", this.listElement);

        this.registerHandlers();
    }

    registerHandlers() {
        // Arrow Function
        this.formElement.onsubmit = event => this.addRepository(event);
    }

    // parametro padrão em uma função
    setLoading(loading = true) {
        if(loading) {
            let loadingEl = document.createElement('span');

            loadingEl.appendChild(document.createTextNode('Carregando'));
            loadingEl.setAttribute('id', 'loading');

            this.formElement.appendChild(loadingEl);
        } else {
            document.getElementById('loading').remove();
        }
    }

    // Async await
    async addRepository(event) {
        event.preventDefault();

        const repoInput = this.inputElement.value;
        if (repoInput.length === 0)
            return;

        this.setLoading();

        // try catch
        try {
            // template literals
            const response = await api.get(`users/${repoInput}`);
            console.log(response);

            // Desestruturação
            const { login, bio, html_url, avatar_url } = response.data;

            // short syntaxe
            this.repositories.push({
                login,
                bio,
                avatar_url,
                html_url
            });

            this.inputElement.value = '';

            this.render();
        } catch (err) {
            alert('O repositório não existe');
        }

        this.setLoading(false);
    }

    render() {
        this.listElement.innerHTML = '';

        this.repositories.forEach(repo => {
            let imgEl = document.createElement('img');
            imgEl.setAttribute('src', repo.avatar_url);

            let titleEl = document.createElement('strong');
            titleEl.appendChild(document.createTextNode(repo.login));

            let descriptionEl = document.createElement('p');
            descriptionEl.appendChild(document.createTextNode(repo.bio));

            let linkEl = document.createElement('a');
            linkEl.setAttribute('target', '_blank');
            linkEl.setAttribute('href', repo.html_url);
            linkEl.appendChild(document.createTextNode('Acessar'));

            let listItemEl = document.createElement('li');
            listItemEl.appendChild(imgEl);
            listItemEl.appendChild(titleEl);
            listItemEl.appendChild(descriptionEl);
            listItemEl.appendChild(linkEl);

            this.listElement.appendChild(listItemEl);
        });
    }
}

new App();