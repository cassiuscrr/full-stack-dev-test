<?php
require 'vendor/autoload.php';

require 'connection.php';

$app = new \Slim\App();

$app->get('/product', function($request, $response, $args) {
    $result = $GLOBALS['db']->query("select * from product order by id desc")->fetchAll(PDO::FETCH_ASSOC);
    if( empty( $result ) ){
        return $response->withStatus(404);
    }else{
        foreach($result as $key=>$val){
            $amount = ( $result[$key]['amount'] ) / 100;
            $result[$key]['amount_format'] = "R$ ". number_format($amount,2,",",".") ;
        }
        return $response->withJson($result, 200);
    }    
});
$app->get('/product/{id}', function($request, $response, $args) {
    $id = $args['id'];
    $result = $GLOBALS['db']->query("select * from product where id = $id")->fetch(PDO::FETCH_ASSOC);
    if( empty( $result ) ){
        return $response->withStatus(404);
    }else{
        $result['created_format'] = str_replace(" ", "T", $result['created']);
        $amount = ( $result['amount'] ) / 100;
        $result['amount_format'] = number_format($amount,2,",",".");
        return $response->withJson($result, 200);
    }    
});
$app->post('/product', function($request, $response, $args) {
    $data = $request->getParsedBody();
    $label['name'] = $data['name'];
    $amount = $data['amount'];
    $amount = str_replace(".", "", $amount);
    $amount = str_replace(",", "", $amount);
    $label['amount'] = (int) $amount;

    $result = $GLOBALS['db']
        ->prepare("insert into product( name, amount ) values ( :name, :amount )")
        ->execute($label);
    if(!$result){
        return $response->withStatus(500);   
    }
    return $response->withStatus(204);
});
$app->post('/product/query', function($request, $response, $args) {
    $data = $request->getParsedBody();
    $query = $data['query'];

    $where[] = "name like '%{$query}%'";
    $where[] = "amount = '$query'";
    $where[] = "created = '$query'";

    $where = "where ". implode( " or ", $where );

    $result = $GLOBALS['db']->query("select * from product {$where} order by id desc")->fetchAll(PDO::FETCH_ASSOC);
    if( empty( $result ) ){
        return $response->withStatus(404);
    }else{
        foreach($result as $key=>$val){
            $amount = ( $result[$key]['amount'] ) / 100;
            $result[$key]['amount_format'] = "R$ ". number_format($amount,2,",",".") ;
        }
        return $response->withJson($result, 200);
    }    
});
$app->put('/product/{id}', function($request, $response, $args) {
    $id = $args['id'];
    $data = $request->getParsedBody();
    $label['name'] = $data['name'];
    $amount = $data['amount'];
    $amount = str_replace(".", "", $amount);
    $amount = str_replace(",", "", $amount);
    $label['amount'] = (int) $amount;
    $label['id'] = (int) $id;
    
    $result = $GLOBALS['db']
        ->prepare("update product set name = :name, amount = :amount where id = :id")
        ->execute($label);
    if(!$result){
        return $response->withStatus(500);   
    }
    return $response->withStatus(204);

});
$app->delete('/product/{id}', function($request, $response, $args) {
    $id = $args['id'];
    $label['id'] = (int) $id;
    $result = $GLOBALS['db']
        ->prepare("delete from product where id = :id")
        ->execute($label);
    if(!$result){
        return $response->withStatus(500);   
    }
    return $response->withStatus(204);
});
$app->run();