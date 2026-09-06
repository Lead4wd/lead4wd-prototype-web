import pathlib
import sys

for f in sys.argv[1:]:
    p = pathlib.Path(f)
    b = p.read_bytes()
    n = b.replace(b"\r\n", b"\n")
    if n != b:
        p.write_bytes(n)
        print("normalised", f, "-", len(b) - len(n), "CR bytes removed")
    else:
        print("already LF", f)
