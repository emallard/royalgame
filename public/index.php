<?php

require_once './vendor/twig/twig/lib/Twig/Autoloader.php';

function startsWith($haystack, $needle)
{
     $length = strlen($needle);
     return (substr($haystack, 0, $length) === $needle);
}

function endsWith($haystack, $needle)
{
    $length = strlen($needle);
    if ($length == 0) {
        return true;
    }

    return (substr($haystack, -$length) === $needle);
}

$filename = __DIR__ . '/' . $_SERVER['REQUEST_URI'];

// fichier existant
if (file_exists($filename) && !is_dir($filename))
{
    return false; // serve the requested resource as-is.
}
// fichiers .ts pour le debug
else if (startsWith($_SERVER['REQUEST_URI'], '/ts'))
{
    echo file_get_contents(__DIR__ . '/../' . $_SERVER['REQUEST_URI']);
}
// liste des blocks disponibles
else if ($_SERVER['REQUEST_URI'] == '/api/get_blocks')
{
    $directory = './public/css/blocks';
    $scanned_directory = array_diff(scandir($directory), array('..', '.'));
    $result = array();
    foreach ($scanned_directory as $f)
    {
        array_push($result, 'blocks/'.$f);
    }
    echo json_encode($result);
}
// scan dir
else if ($_SERVER['REQUEST_URI'] == '/api/scandir')
{
    $dir = $_POST["dir"];
    if (!file_exists($dir))
    {
        mkdir($dir);
    }
    $scanned_directory = array_diff(scandir($dir), array('..', '.'));
    echo json_encode($scanned_directory);
}
// put contents
else if ($_SERVER['REQUEST_URI'] == '/api/file_put_contents')
{
    $filename = $_POST["filename"];
    $content = $_POST["content"];
    file_put_contents($filename, $content);
    echo "ok";
}
// get contents
else if ($_SERVER['REQUEST_URI'] == '/api/file_get_contents')
{
    $filename = $_POST["filename"];
    $content = file_get_contents($filename);
    echo $content;
}
// fichiers twig
else
{
    Twig_Autoloader::register();
    $loader = new Twig_Loader_Filesystem('./public');
    $twig = new Twig_Environment($loader, array());

    if (file_exists($filename.'.twig'))
    {
        $template = $twig->loadTemplate($_SERVER['REQUEST_URI'].'.twig');
        echo $template->render(array('the' => 'variables', 'go' => 'here'));
    }
    else if (file_exists($filename.'/index.twig'))
    {
        $template = $twig->loadTemplate($_SERVER['REQUEST_URI'].'/index.twig');
        echo $template->render(array('the' => 'variables', 'go' => 'here'));
    }
    else
    {
        return false;
    }

}
