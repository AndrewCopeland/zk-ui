import subprocess

def _subprocess(command):
    return subprocess.check_output(command).decode('utf-8')

def _str_to_list(input):
    return input.split("\n")[:-1]

def list():
    return _str_to_list(_subprocess(['zk', 'list']))

def cat(title):
    return _subprocess(['zk', 'cat', title])

def open_browser(title):
    return _subprocess(['zk', 'open-browser', title])

def open_code(title):
    return _subprocess(['zk', 'open-code', title])

def search(search):
    return _str_to_list(_subprocess(['zk', 'search', search]))

def new_code(title):
    return _subprocess(['zk', 'new-code', title])
