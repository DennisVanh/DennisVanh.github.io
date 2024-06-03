async function GetJSON() {
    var obj;
    await fetch('vis.json')
        .then(response => response.json())
        .then(jsonResponse => {obj = jsonResponse})
    return obj;
}

function compareZCoord(x, y){
    if(x.z == null) return -1;
    if(y.z == null) return 1;
    if(x.z < y.z) return -1;
    if(x.z > y.z) return 1;
    else return 0;
}

function drawNewRect(svgEl, element){
    var x = parseFloat(element.x);
    var y = parseFloat(element.y);
    var id = element.id;
    var parent = element.parent;
    var color = element.color;
    var rotation = parseFloat(element.rotation);
    var width = parseFloat(element.width);
    var height = parseFloat(element.height);
    
    svgEl.rect(width,height).transform({
        translate : [x,y],
        rotate: rotation
    }).fill(color).stroke('black').opacity(0).id(id);
    SVG('#' + id).animate().opacity(1);

    if(parent != null){
        if(SVG('#' + parent) == null){
            svgEl.group().id(parent)
        }
        SVG('#' + parent).add('#' + id)
    }
}

function updateRect(element){
    var x = parseFloat(element.x);
    var y = parseFloat(element.y);
    var id = element.id;
    var color = element.color;
    var rotation = parseFloat(element.rotation);
    var width = parseFloat(element.width);
    var height = parseFloat(element.height);

    SVG('#' + id).animate().transform({
        translate : [x, y],
        rotate: rotation
    }).animate().attr({
        width : width,
        height : height,
    })
    SVG('#' + id).fill(color);
}

function drawNewCircle(svgEl, element){
    var x = parseFloat(element.x);
    var y = parseFloat(element.y);
    var id = element.id;
    var parent = element.parent;
    var color = element.color;
    var rotation = parseFloat(element.rotation);
    var radius = parseFloat(element.r);

    svgEl.circle(radius*2).transform({
        translate : [x,y],
        rotate: rotation
    }).fill(color).stroke('black').opacity(0).id(id);
    SVG('#' + id).animate().opacity(1);

    if(parent != null){
        if(SVG('#' + parent) == null){
            svgEl.group().id(parent)
        }
        SVG('#' + parent).add('#' + id)
    }
}

function updateCircle(element){
    var x = parseFloat(element.x);
    var y = parseFloat(element.y);
    var id = element.id;
    var color = element.color;
    var rotation = parseFloat(element.rotation);
    var radius = parseFloat(element.r);

    SVG('#' + id).animate().transform({
        translate : [x,y],
        rotate: rotation
    }).animate().attr({
        r : radius
    })
    SVG('#' + id).fill(color);
}

function drawNewLine(svgEl, element){
    var x1 = parseFloat(element.x1);
    var y1 = parseFloat(element.y1);
    var x2 = parseFloat(element.x2);
    var y2 = parseFloat(element.y2);
    var id = element.id;
    var parent = element.parent;
    var color = element.color;
    var rotation = parseFloat(element.rotation);

    svgEl.line(x1, y1, x2, y2).rotate(rotation).stroke(color).opacity(0).id(id)
    SVG('#' + id).animate().opacity(1);

    if(parent != null){
        if(SVG('#' + parent) == null){
            svgEl.group().id(parent)
        }
        SVG('#' + parent).add('#' + id)
    }
}

function updateLine(element){
    var x1 = parseFloat(element.x1);
    var y1 = parseFloat(element.y1);
    var x2 = parseFloat(element.x2);
    var y2 = parseFloat(element.y2);
    var id = element.id;
    var parent = element.parent;
    var color = element.color;
    var rotation = parseFloat(element.rotation);


    SVG('#' + id).animate().transform({
        translate : [x1,y1],
        rotate: rotation
    })
    SVG('#' + id + '-shape').animate().attr({
        //r : radius
    })
    SVG('#' + id + '-shape').stroke(color);
}

function drawNewText(svgEl, element){
    var x = parseFloat(element.x);
    var y = parseFloat(element.y);
    var id = element.id;
    var parent = element.parent;
    var color = element.color;
    var rotation = parseFloat(element.rotation);
    var label = element.label;
    var size = element.size

    svgEl.text(label).transform({
        translate : [x,y],
        rotate: rotation
    }).font({fill: 'color', size: size}).opacity(0).id(id);
    //.fill(color).opacity(0).id(id);
    SVG('#' + id).animate().opacity(1);

    if(parent != null){
        if(SVG('#' + parent) == null){
            svgEl.group().id(parent)
        }
        SVG('#' + parent).add('#' + id)
    }
}

function updateText(element){
    var x = parseFloat(element.x);
    var y = parseFloat(element.y);
    var id = element.id;
    var color = element.color;
    var rotation = parseFloat(element.rotation);
    var label = element.label;
    var size = element.size

    SVG('#' + id).animate().transform({
        translate : [x, y],
        rotate: rotation
    })
    SVG('#' + id).fill(color);
}


async function visualize(){
    const json = await GetJSON();
    var lst = json.visualization;

    var draw = SVG().addTo('#container').width(1600).height(1000)
    currentTime = 0;
    document.getElementById('container').onclick = function() {
        timestep = lst[currentTime];
        if(timestep == null){
            draw.clear();
            currentTime = 0;
            timestep = lst[currentTime];
        }
        var elements = timestep.elements;
        elements.sort(compareZCoord);
        elements.forEach(element => {
            if(element.visible === 'false'){
                if(SVG('#' + element.id) != null){
                    SVG('#' + element.id).animate().opacity(0).after(()=>{if(SVG('#' + element.id) != null) SVG('#' + element.id).remove()});
                }
                return;
            }
            var shape = element.shape;
            var id = element.id;
            if(shape == "group"){
                var x = parseInt(element.x)
                var y = parseInt(element.y)
                var rotation = parseInt(element.rotation)
                if(SVG('#' + id) == null){
                    draw.group().transform({
                        translate : [x,y],
                        rotate: rotation
                    }).id(id)
                }
                else {
                    SVG('#' + id).animate().transform({
                        translate : [x,y],
                        rotate: rotation
                    });
                }
            }
            else if(shape == "rect"){
                if(SVG('#' + id) == null){
                    drawNewRect(draw, element);
                }
                else {
                    updateRect(element);
                }
            }
            else if(shape == "circle"){
                if(SVG('#' + id) == null){
                    drawNewCircle(draw, element);
                }
                else {
                    updateCircle(element);
                }
            }
            else if(shape == "line"){
                if(SVG('#' + id) == null){
                    drawNewLine(draw, element);
                }
                else {
                    updateLine(element);
                }
            }
            else if(shape == "numtext"){
                if(SVG('#' + id) == null){
                    drawNewText(draw, element);
                }
                else {
                    SVG('#' + id).remove();
                    drawNewText(draw, element);
                }
            }
        });
        currentTime += 1;
    };
}

visualize();
