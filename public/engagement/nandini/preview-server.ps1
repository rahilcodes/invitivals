# Tiny static file server for previewing the invitation locally (concurrent, with Range support for audio).
# Usage:  powershell -ExecutionPolicy Bypass -File preview-server.ps1   then open http://localhost:8123
param([int]$Port = 8123)
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

Add-Type -TypeDefinition @'
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Threading;

public static class InviteServer {
  static readonly Dictionary<string, string> Types = new Dictionary<string, string> {
    {".html","text/html; charset=utf-8"}, {".css","text/css; charset=utf-8"}, {".js","application/javascript; charset=utf-8"},
    {".jpg","image/jpeg"}, {".jpeg","image/jpeg"}, {".png","image/png"}, {".webp","image/webp"}, {".svg","image/svg+xml"},
    {".mp3","audio/mpeg"}, {".mp4","video/mp4"}, {".webm","video/webm"}, {".ics","text/calendar"}, {".json","application/json"}, {".ico","image/x-icon"}, {".woff2","font/woff2"}
  };

  public static void Run(string root, int port) {
    root = Path.GetFullPath(root);
    var listener = new HttpListener();
    listener.Prefixes.Add("http://localhost:" + port + "/");
    listener.Start();
    Console.WriteLine("Serving " + root + " at http://localhost:" + port + "/");
    while (listener.IsListening) {
      HttpListenerContext ctx = listener.GetContext();
      ThreadPool.QueueUserWorkItem(delegate { Handle(ctx, root); });
    }
  }

  static void Handle(HttpListenerContext ctx, string root) {
    HttpListenerResponse res = ctx.Response;
    try {
      string rel = Uri.UnescapeDataString(ctx.Request.Url.AbsolutePath).TrimStart('/');
      if (rel.Length == 0) rel = "index.html";
      string path = Path.GetFullPath(Path.Combine(root, rel));
      if (!path.StartsWith(root, StringComparison.OrdinalIgnoreCase) || !File.Exists(path)) { res.StatusCode = 404; return; }

      string type;
      res.ContentType = Types.TryGetValue(Path.GetExtension(path).ToLowerInvariant(), out type) ? type : "application/octet-stream";
      res.Headers["Cache-Control"] = "no-cache";
      res.Headers["Accept-Ranges"] = "bytes";

      using (FileStream fs = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.ReadWrite)) {
        long total = fs.Length, start = 0, end = total - 1;
        string range = ctx.Request.Headers["Range"];
        if (!string.IsNullOrEmpty(range) && range.StartsWith("bytes=")) {
          string[] p = range.Substring(6).Split('-');
          if (p[0].Length > 0) start = long.Parse(p[0]);
          if (p.Length > 1 && p[1].Length > 0) end = Math.Min(total - 1, long.Parse(p[1]));
          if (start > end || start >= total) { res.StatusCode = 416; return; }
          res.StatusCode = 206;
          res.Headers["Content-Range"] = "bytes " + start + "-" + end + "/" + total;
        }
        long left = end - start + 1;
        res.ContentLength64 = left;
        if (ctx.Request.HttpMethod == "HEAD") return;
        fs.Seek(start, SeekOrigin.Begin);
        byte[] buf = new byte[65536];
        while (left > 0) {
          int n = fs.Read(buf, 0, (int)Math.Min(buf.Length, left));
          if (n <= 0) break;
          res.OutputStream.Write(buf, 0, n);
          left -= n;
        }
      }
    } catch (Exception) {
      try { res.StatusCode = 500; } catch (Exception) { }
    } finally {
      try { res.OutputStream.Close(); } catch (Exception) { }
    }
  }
}
'@

[InviteServer]::Run($root, $Port)
