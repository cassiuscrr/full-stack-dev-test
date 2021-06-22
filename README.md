
# Instalação da Api

> cd api
>
> composer install


* Foi utilizada a Slim Framework para gerenciamento das Rotas do PHP, assim como os protocolos HTTP
* Tecnologia SaSS, e o Live Compilator
* Abordei noções de componentes, cleancode e factory
* Bootstrap 5
* Jquery
* Miranda Json
* JMask


> Note que a página de visão encontra-se na pasta dist e as rotas na api

> Note tambem, que o Dinheiro está em centavos devendo ser divido por 100 sempre que necessário. Optei por isso por dois motivos, conversão e controle dentro da api, e por hoje em dia encontrar muitas Api Restfull que utilizam o dinheiro em centavos. 





# Base de dados



```mysql
DROP TABLE IF EXISTS `product`;
CREATE TABLE IF NOT EXISTS `product` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(250) NOT NULL,
  `amount` bigint(20) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin2;
```



>  api
>
> >  connection.php

```php
new PDO('mysql:host=localhost;dbname=full_stack_dev_test', 'root','');
# alterar a string de conexão na linha 2 do arquivo connection.php
```

