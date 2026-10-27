"""Fetch the newest videos from the Otoneso YouTube channel into videos.json.

Runs in GitHub Actions (see .github/workflows/videos.yml). Shorts are skipped.
"""
import json
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET

CHANNEL_ID = "UCQmGV5Bl4oSND8IEPAif9-Q"
FEED = f"https://www.youtube.com/feeds/videos.xml?channel_id={CHANNEL_ID}"
LIMIT = 5
NS = {"a": "http://www.w3.org/2005/Atom", "yt": "http://www.youtube.com/xml/schemas/2015"}
UA = {"User-Agent": "Mozilla/5.0 (otoneso.com video sync)"}


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None


def is_short(video_id):
    # /shorts/<id> answers 200 for a Short and redirects to /watch for a regular video
    opener = urllib.request.build_opener(NoRedirect)
    try:
        return opener.open(urllib.request.Request(f"https://www.youtube.com/shorts/{video_id}", headers=UA), timeout=20).status == 200
    except urllib.error.HTTPError:
        return False


def main():
    with urllib.request.urlopen(urllib.request.Request(FEED, headers=UA), timeout=30) as r:
        root = ET.fromstring(r.read())
    videos = []
    for e in root.findall("a:entry", NS):
        vid = e.findtext("yt:videoId", namespaces=NS)
        if not vid or is_short(vid):
            continue
        videos.append({"id": vid, "title": e.findtext("a:title", namespaces=NS).strip(),
                       "published": e.findtext("a:published", namespaces=NS)[:10]})
        if len(videos) == LIMIT:
            break
    if not videos:
        raise SystemExit("no videos found, keeping the old videos.json")
    with open("videos.json", "w", encoding="utf-8") as f:
        json.dump(videos, f, ensure_ascii=False, indent=1)
        f.write("\n")
    print(f"saved {len(videos)} videos, newest: {videos[0]['title']}")


if __name__ == "__main__":
    main()
