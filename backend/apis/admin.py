
from flask import (
    Blueprint, request,
    redirect, flash,
    url_for, render_template, send_file
)


admin = Blueprint('admin', __name__, url_prefix="/admin")