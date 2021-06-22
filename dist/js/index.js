const schema = $("#table-itens").html()
const url = "http://localhost/full-stack-dev-test/api"

$(document).ready( function(){
    loading_start()    
    refreshList()
})

$('.input__money').mask("#.##0,00", {reverse: true})

function loading_start(){
    $(".box-loading").css("display", "flex")
}

function loading_end(){
    $(".box-loading").css("display", "none")
}

function reset_result(){
    $(".not_result").removeClass("d-flex").addClass("d-none")
    $(".has_result").addClass("d-none")
}

function not_result(){
    $(".not_result").removeClass("d-none").addClass("d-flex")
    loading_end()
}

function has_result(){
    $(".has_result").removeClass("d-none")
    loading_end()
}

function refreshList(){
    reset_result()
    $("#table-itens").html(schema)
    findAll()
    .then( ( json ) => {
        if( json.length == 0) {
            not_result()
        }else{
            $("#table-itens").mirandajs( json )
            has_result()
        }
    })
}

function closeModal(){
    $(".modal").modal('hide')
}


async function findAll(){
    let result
    try{    
        result = await $.ajax({
            url: `${url}/product`,
            type:"GET",
            dataType: "json",
        })
        return result
    } catch( error ) {
        return []
    }
}
async function findByID( ID ){
    let result
    try{    
        result = await $.ajax({
            url: `${url}/product/${ID}`,
            type:"GET",
            dataType: "json",
        })
        return result
    } catch( error ) {
        return []
    }
}
async function findByQuery( query ){
    let result
    try{    
        result = await $.ajax({
            url: `${url}/product/query`,
            type:"POST",
            data: { query },
            dataType: "json",
        })
        return result
    } catch( error ) {
        return []
    }
}

async function createItem( input ){
    let result
    try{    
        result = await $.ajax({
            url: `${url}/product`,
            type:"POST",
            data: input,
            dataType: "json",
        })
        return result
    } catch( error ) {
        return error
    }
}
async function editItem( input ){
    let el = input.find( el => el.name == 'id')
    let id = el.value
    let result
    try{    
        result = await $.ajax({
            url: `${url}/product/${id}`,
            type:"PUT",
            data: input,
            dataType: "json",
        })
        return result
    } catch( error ) {
        return error
    }
}

async function deleteItem( input ){
    let el = input.find( el => el.name == 'id')
    let id = el.value
    let result
    try{    
        result = await $.ajax({
            url: `${url}/product/${id}`,
            type:"DELETE",
            data: input,
            dataType: "json",
        })
        return result
    } catch( error ) {
        return error
    }
}



$(".btn-search").on("click", function() {        
    loading_start()
    let query = $(".search-box").val()
    if( !query || query == 0 ) {
        refreshList()
        loading_end();
        return;
    }
    findByQuery( query )
    .then( ( json ) => {
        $("#table-itens").html(schema)
            reset_result()
        if( !json || json.length == 0) {
            not_result()
        }else{
            $("#table-itens").mirandajs( json )
            has_result()
        }
    })
    .finally( () => {
        loading_end()
    }) 
})
$(".btn-new").on("click", function() {
    $("#modal_new").find("[name]").val('')
    $("#modal_new").modal('show')
})
$(document).on("click",".btn-view", function() {
    loading_start()
    let id = $(this).data('id');
    findByID( id )
    .then( ( json ) => {
        $("#modal_view").find("[name=name]").attr("value", json.name)
        $("#modal_view").find("[name=amount]").attr("value", json.amount_format)
        $("#modal_view").find("[name=created]").attr("value", json.created_format)
        $("#modal_view").modal('show')
    })
    .finally( () => {
        loading_end()
    })  
})
$(document).on("click",".btn-edit", function() {
    loading_start()
    let id = $(this).data('id')
    findByID( id )
    .then( ( json ) => {
        $("#modal_edit").find("[name=id]").val(json.id)
        $("#modal_edit").find("[name=name]").val(json.name)
        $("#modal_edit").find("[name=amount]").val(json.amount_format)
        $("#modal_edit").find("[name=created]").attr("value", json.created_format)
        $("#modal_edit").modal('show')
    })
    .finally( () => {
        loading_end()
    }) 
})
$(document).on("click",".btn-delete", function() {
    loading_start()
    let id = $(this).data('id');
    findByID( id )
    .then( ( json ) => {
        $("#modal_delete").find("[name=id]").val(json.id)
        $("#modal_delete").find("[name=name]").val(json.name)
        $("#modal_delete").modal('show')
    })
    .finally( () => {
        loading_end()
    }) 
})

$("#modal_new form").on("submit",function( e ){
    e.preventDefault()
    let input = $(this).serializeArray()
    loading_start()
    createItem( input )
    .catch( (data) => {
        alert( "Não foi possivel cadastrar" )
    })
    .finally( () => {
        refreshList()
        closeModal()
    })
})
$("#modal_edit form").on("submit",function( e ){
    e.preventDefault()
    let input = $(this).serializeArray()
    loading_start()
    editItem( input )
    .catch( _ => {
        alert( "Não foi possivel cadastrar" )
    })
    .finally( () => {
        refreshList()
        closeModal()
    })
})

$("#modal_delete form").on("submit",function( e ){
    e.preventDefault()
    let input = $(this).serializeArray()
    loading_start()
    deleteItem( input )
    .catch( _ => {
        alert( "Não foi possivel cadastrar" )
    })
    .finally( () => {
        refreshList()
        closeModal()
    })
})