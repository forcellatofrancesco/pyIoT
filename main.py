from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from starlette.responses import FileResponse
from pydantic import BaseModel
import random
import time


class Lightbulb(BaseModel):
    name: str | None = None
    status: bool = False


light: Lightbulb = Lightbulb(name="Light 1")

app = FastAPI()


app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
async def get_index():
    return FileResponse("static/index.html")


@app.get("/temperature")
def read_temp():
    return {"temp": random.randint(2000, 9000)/100.}


@app.get("/time")
def read_time():
    res: str = time.strftime("%H:%M:%S", time.localtime())
    return {"time": res}


@app.get("/day")
def read_day():
    res: str = time.strftime("%d/%m/%Y")
    return {"day": res}


@app.put("/lightbulb")
async def update_lightbulb(lightbulb: Lightbulb):
    global light
    light = lightbulb
    return light


@app.get("/lightbulb")
def read_lightbulb():
    return light


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
