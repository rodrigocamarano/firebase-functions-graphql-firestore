# firebase-functions-graphql-firestore

## Exemplo utilizando Firebase Functions, Firebase Firestore e GraphQL

### Criação do projeto no Firebase
Acesse http://console.firebase.google.com, crie um projeto e a seguir habilite:
- **Firestore** (Database/Firestore)
- **Functions**

Caso não tenha a CLI do **Firebase** instalada, execute o comando a seguir:
```sh
$ sudo npm install -g firebase-tools
```

### Baixe o repositório e instale as dependências
```sh
$ git clone https://github.com/rodrigocamarano/firebase-functions-graphql-firestore.git
$ cd firebase-functions-graphql-firestore
$ cd functions
$ npm i
$ cd ..
```

### Realize login no Firebase
```sh
$ firebase login
```
### Reinicialize o projeto no diretório raiz
```sh
$ firebase init
```
### Configurações do Firebase CLI
Com a tecla **Espaço** selecione
- **Firestore:** Deploy rules and create indexes for Firestore
- **Functions:** Configure and deploy Cloud Functions

Pressione **Enter**

Selecione **Use an existing project** e pressione **Enter**

Selecione o projeto criado e pressione **Enter**

Em **What file should be used for Firestore Rules?** pressione **Enter**

Em **What file should be used for Firestore indexes?** pressione **Enter**

Em **What language would you like to use to write Cloud Functions?** selecione **JavaScript** e pressione **Enter**

Em **Do you want to use ESLint to catch probable bugs and enforce style?** selecione **JavaScript** e pressione **N**

Em **Do you want to install dependencies with npm now?** pressione **Y**

### Acessando o diretório principal do projeto

No diretório raiz do projeto acesse
```sh
$ cd functions
```
### Deploy da aplicação
No diretório raiz do projeto acesse
```sh
$ firebase deploy
```
Um endpoint será criado. Para acessá-lo: 
- Vá ao painel do **Firebase** 
- Click em **Functions**
- Acesse a aba **Painel**

Você encontrará o endereço do endpoint

### Acessando a aplicação criada

Acrescente ao endpoint gerado o sufixo **/graphql**

### Testes
Para realizar testes você pode estar utilizando o **Insomnia**(https://insomnia.rest/download/) com o método **POST / GraphQL** conforme exemplo abaixo:
```sh
https://us-central1-project.cloudfunctions.net/api/graphql
```
## Categorias
### Inclusão de categoria
```sh
mutation CreateCategory {
  createCategory(categoryInput: {title: "Category 1", isFeatured: true}) {
    _id
    title
    slug
    isFeatured
    createdAt
    updatedAt
  }
}
```
### Alteração de categoria (substitua o ID)
```sh
mutation UpdateCategory {
  updateCategory(id: "1bKPSEtWAeY1jJeR5SLM", categoryInput: {title: "Category 1", isFeatured: true}) {
    _id
    title
    slug
    isFeatured
    createdAt
    updatedAt
  }
}
```
### Exibir categoria pelo ID (substitua o ID)
```sh
query Category {
  category(id: "1bKPSEtWAeY1jJeR5SLM") {
    _id
    title
    slug
    isFeatured
    createdAt
    updatedAt
    products {
      _id
      title
      slug
      description
      details
      price
      isService
      isActivated
      isFeatured
      createdAt
      updatedAt
    }
  }
}
```
### Exibir todas as categorias
```sh
query Categories {
  categories {
    categories {
      _id
      title
      slug
      isFeatured
      createdAt
      updatedAt
      products {
        _id
        title
        slug
        description
        details
        price
        isService
        isFeatured
        createdAt
        updatedAt
      }
    }
    totalRecords
    totalPages
  }
}
```
### Excluir categoria (substitua o ID)
```sh
mutation DeleteCategory {
  deleteCategory(id: "1bKPSEtWAeY1jJeR5SLM")
}
```
## Produtos
### Inclusão de produto
```sh
mutation CreateProduct {
  createProduct(productInput: {title: "Product 1", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse elit diam, imperdiet nec mi quis, viverra ultrices enim.", details: "Curabitur semper, tellus vel lacinia feugiat, velit neque euismod augue, quis convallis nunc dui ac arcu. Suspendisse id pellentesque neque. Nulla facilisi. In rutrum magna dui, eget porttitor lacus tempus nec. Fusce id pellentesque felis, et varius justo. Maecenas vel orci sollicitudin, hendrerit quam et, vestibulum nunc. Morbi quis nulla ornare, suscipit enim nec, convallis turpis. Aliquam et condimentum tellus. Aliquam efficitur imperdiet tempus. Vestibulum vitae eros non sem pellentesque euismod pulvinar a odio. Quisque a nunc sit amet odio luctus mattis.", price: 50, isService: true, isActivated: true, isFeatured: true}) {
    _id
    title
    slug
    description
    details
    price
    isService
    isActivated
    isFeatured
    createdAt
    updatedAt
  }
}
```
### Alteração de produto (substitua o ID)
```sh
mutation UpdateProduct {
  updateProduct(id: "ixijLttUpV8ziTCwO6RT", productInput: {title: "Product 1", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse elit diam, imperdiet nec mi quis, viverra ultrices enim.", details: "Curabitur semper, tellus vel lacinia feugiat, velit neque euismod augue, quis convallis nunc dui ac arcu. Suspendisse id pellentesque neque. Nulla facilisi. In rutrum magna dui, eget porttitor lacus tempus nec. Fusce id pellentesque felis, et varius justo. Maecenas vel orci sollicitudin, hendrerit quam et, vestibulum nunc. Morbi quis nulla ornare, suscipit enim nec, convallis turpis. Aliquam et condimentum tellus. Aliquam efficitur imperdiet tempus. Vestibulum vitae eros non sem pellentesque euismod pulvinar a odio. Quisque a nunc sit amet odio luctus mattis.", price: 50, isService: true, isActivated: false, isFeatured: true}) {
    _id
    title
    slug
    description
    details
    price
    isService
    isFeatured
    createdAt
    updatedAt
    categories {
      _id
      title
      slug
      isFeatured
      createdAt
      updatedAt
    }
  }
}
```
### Exibir produto pelo ID (substitua o ID)
```sh
query Product {
  product(id: "ixijLttUpV8ziTCwO6RT") {
    _id
    title
    slug
    description
    details
    price
    isService
    isFeatured
    createdAt
    updatedAt
    categories {
      _id
      title
      slug
      isFeatured
      createdAt
      updatedAt
    }
  }
}
```
### Exibir todos os produtos
```sh
query Products {
  products {
    products {
      _id
      title
      slug
      description
      details
      price
      isService
      isFeatured
      createdAt
      updatedAt
      categories {
        _id
        title
        slug
        isFeatured
        createdAt
        updatedAt
      }
    }
    totalRecords
    totalPages
  }
}
```
### Excluir produto (substitua o ID)
```sh
mutation DeleteProduct {
  deleteProduct(id: "ixijLttUpV8ziTCwO6RT")
}
```
### Vincular produto à categoria (substitua os IDs)
```sh
mutation CreateProduct {
  createProductCategory(productId: "ixijLttUpV8ziTCwO6RT", categoryId: "1bKPSEtWAeY1jJeR5SLM") {
    _id
      title
      slug
      description
      details
      price
      isService
      isFeatured
      createdAt
      updatedAt
      categories {
        _id
        title
        slug
        isFeatured
        createdAt
        updatedAt
      }
  }
}
```
### Desvincular produto da categoria (substitua os IDs)
```sh
mutation DeleteProductCategory {
  deleteProductCategory(productId: "ixijLttUpV8ziTCwO6RT", categoryId: "1bKPSEtWAeY1jJeR5SLM") {
    _id
      title
      slug
      description
      details
      price
      isService
      isFeatured
      createdAt
      updatedAt
      categories {
        _id
        title
        slug
        isFeatured
        createdAt
        updatedAt
      }
  }
}
```