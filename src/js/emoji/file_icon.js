const all_file_types = {
    "text/x-c": "h",
    "text/coffeescript": "coffee",
    "text/css": "css",
    "application/vnd.dart": "dart",
    "application/x-msdownload": "exe",
    "text/html": "html",
    "application/java-archive": "jar",
    "text/x-java-source": "java",
    "application/json": "json",
    "application/x-iwork-keynote-sffkey": "key",
    "text/less": "less",
    "text/plain": "log",
    "text/x-lua": "lua",
    "text/markdown": "markdown",
    "text/mdx": "mdx",
    "application/xv+xml": "mxml",
    "application/pdf": "pdf",
    "application/x-httpd-php": "php",
    "application/raml+yaml": "raml",
    "text/x-sass": "sass",
    "text/slim": "slim",
    "text/stylus": "stylus",
    "image/svg+xml": "svg",
    "application/x-tcl": "tcl",
    "application/x-tex": "tex",
    "application/xaml+xml": "xaml",
    "text/xml": "xml",
    "text/yaml": "yaml",
    "application/yang": "yang",
    "application/zip": "zip",
	"application/javascript" : "js",
	"text/javascript" : "js",
	"application/vnd.android.package-archive" : "apk",
	"filetype/fl-studio-project" : "flp",
	"model/obj" : "obj",
	"model/gltf+json" : "gltf",
	"image/jpeg" : "jpg",
	"image/png" : "png"
}

function getExt(mime) {
	for(i in all_file_types) {
		if (i == mime) {
			return all_file_types[i]
		}
	}
	return 'txt'
}

function mime_filetype_svg(name, scale = 20){
	var icon = new Image();
	icon.src = mime_filetype_svg_src(name);
	icon.height = scale;
	icon.width = scale;
	icon.setAttribute('name', name);
	icon.setAttribute('class', 'icon');
	return icon;
}

function mime_filetype_svg_src(mtype, ext){
	var x = all_file_types[mtype];
	if(x != null) return '/res/filetypes/' + all_file_types[mtype] + '.svg';
	else if(ext != null) return ext_filetype_svg_src(ext)
	else return '/res/filetypes/file.svg';
}


function ext_filetype_svg_src(ext){
    if( Object.values(all_file_types).includes(ext) ) return '/res/filetypes/' + ext + '.svg';
	else return '/res/filetypes/file.svg';
}

