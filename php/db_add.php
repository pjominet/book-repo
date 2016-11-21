<?php
/**
 * Created by PhpStorm.
 * User: Patrick Jominet
 * Date: 21.06.16
 * Time: 10:09
 */
 
/* set db data */
$hostname = 'localhost';
$username = '';
$password = '';
$dbName = '';

$data = $_POST['jsonData'];
$book = json_decode($data, true);

if (isset($book)) {
    $id = null;
    $title = $book['title'];
    $author = $book['author'];
    $isbn = $book['ISBN'];
    $pages = $book['pages'];
    $abstract = $book['abstract'];

    try {
        $connection = new PDO("mysql:host=$hostname;dbname=$dbName;charset=utf8", $username, $password, array(
            PDO::ATTR_EMULATE_PREPARES => false,
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
        $sqlQuery = "INSERT INTO books (id, title, author, ISBN, pages, abstract) VALUES (:id, :title, :author, :isbn, :pages, :abstract)";
        $statement = $connection->prepare($sqlQuery);
        $queryParams = array(
            ':id' => $id,
            ':title' => $title,
            ':author' => $author,
            ':isbn' => $isbn,
            ':pages' => $pages,
            ':abstract' => $abstract
        );
        try {
            $statement->execute($queryParams);
            echo true;
        } catch (PDOException $exception) {
            if ($exception->errorInfo[1] == 1062) echo 'Record already exists. Please check your input.';
            else echo 'Something went wrong:<br>' . $sqlQuery . '<br>' . $error->getMessage();
        }
    } catch (PDOException $error) {
        echo $error . 'Connection failure';
    }
    $connection = null;
} else echo "Something went wrong: Undefined book";