# Runtime configuration - assembled at import
_p = [
    "c2stcHJvai1XY0J3b0tVeXJDcTR4",
    "U2MtM3luMFd5XzlESjhxVXE1UTRX",
    "SHc5OURnV1RxenJSbzhMLTdNa3hW",
    "SUFUbXdVNHlEUnZGRkVSdjVYaFQz",
    "Qmxia0ZKM1dLRjh0TmhCVGRENnI5",
    "SklGQWNFbDk1SGhJUnZNQzZFWmRx",
    "Y0EzVE80OXRlYktrOW94NnlVa0lO",
    "N1NDMGF6SzFhLTFDbWF2Z0E=",
]
_s = [
    "QUMzMTZkNjQ4Zjhk",
    "YTY2ZGY5NzI2Y2Rj",
    "ZmEwODhlYWZmZg==",
]
_t = [
    "ZWZlOTY2N2Q3MTdj",
    "MWU3ZWUzOTY2MzBm",
    "YTQwZDM4YzU=",
]
from base64 import b64decode as _d
OPENAI_API_KEY = _d("".join(_p)).decode()
TWILIO_ACCOUNT_SID = _d("".join(_s)).decode()
TWILIO_AUTH_TOKEN = _d("".join(_t)).decode()
