## Ferramentas e dependencias usadas
> Todos comandos são executados via terminal na pasta src

* Visual Studio code (ou qualquer IDE)
* NodeJS (importante para utilizar o NPM que será o gerenciador de pacotes), disponivel em https://www.npmjs.com/get-npm
* Express, pelo comado: npm intall express.
* Nodemon, pelo comando: npm install nodemon.
* Jmeter, disponivel na pasta apache-jmeter.
* Caso na pasta src não seja encontrado "package.json", executar npm init -y, após isso na aba de scripts adicionar este trecho (colocando uma virgula no fim da 
linha anterior): "start": "nodemon server.js"
* Executar o comando npm start, que iniciará a aplicação

# Execução do programa

## Inicialização
* Para cada nucleo do processador da máquina será escrito "Starting up worker N: " e o numero do worker
* Após isso o programa informará a porta de execução (localhost:3000/products)

## Lógica de filtragem
* Requisições são jogadas em um "buffer" feito com uma array, e caso uma requisição com mesmo corpo (id, name e user).
seja enviada, será retornado erro 403, se a requisição tiver um corpo diferente porem um id igual, será atribuido um novo id.

## Exemplo:
### Requisição com mesmo id e conteúdo diferente
> id: 1 user: cleber nome: mesa -> ok (200)

> id: 1 user: cleber nome: cadeira -> ok (200) (gera novo id)

### Requisição igual em intervalo de 10 minutos
> id: 1 user: cleber nome: mesa -> ok (200)

>  id: 1 user: cleber nome: mesa -> forbidden (403)


# Execução do teste

## Passo a passo
* Abrir pelo terminal a pasta bin dentro de apache-jmeter (apache-jmeter-5.3 -> bin), executar comando "jmeter" (sem aspas), que irá abrir a interface gráfica
* Abrir arquivo de teste (file -> open -> selecionar arquivo teste.jmx)
* Na interface gráfica pode-se configurar o numero de threads (aba Thread group)
* Expandindo a aba Thread group, na opção HTTP Request, caso necessário pode-se alterar a porta (já configurada em 3000), o método (POST), e caminho/route (/products)
* Pode se alterar o arquivo que fornecerá corpos de request e como ele é estruturado (aba CSV data set config),
* Já na aba View Results Tree tem-se os resultados das requests com informações de cada uma delas
* alterar local de salvamento do log XML na aba results tree caso necessário
* alimentar o teste com o arquivo Dummy.CSV disponivel, fornecerá 1000 registros (compostos por id, user e name) prontos
* rodar linha de comando abaixo para testar e gerar relatório
* jmeter -n -t [local do arquivo teste.jmx] -l [local desejado para resultados] -e -o [local desejado para geração de representações gráficas de desempenho]
* Overview gráfico estára disponivel dentro da pasta criada na linha de código executado, o arquivo será chamado index.hmtl



