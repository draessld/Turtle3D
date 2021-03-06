/*
VERZE 0.4.2 J.L.
*/

// A-FRAME
var scene = document.getElementById('scene01');

// SUBFUNCTIONS
function addMatrices(mA, mB) {
    return math.add(mA, mB);
}

/*
FUNGUJE D.D
*/
function multiplyMatrices(mA, mB) {
    return math.multiply(mA, mB);
}

/*
FUNGUJE D.D.
*/
function matrixInvert(M) {
    return math.inv(M);
}

/*
NAJDE STŘEDNÍ BOD.
FUNGUJE DOBŘE, ZMĚNA V0.3 J.L.
*/
function getMiddlePoint(originPoint, endPoint) {
    x = originPoint[0] + ((endPoint[0] - originPoint[0]) / 2);
    y = originPoint[1] + ((endPoint[1] - originPoint[1]) / 2);
    z = originPoint[2] + ((endPoint[2] - originPoint[2]) / 2);
    return [x, y, z];
}

/*
PŘEDDEFINOVÁNO
*/
function getRotationXMatrix(angle) {
    return math.matrix([
        [1, 0, 0],
        [0, Math.cos(angle), -Math.sin(angle)],
        [0, Math.sin(angle), Math.cos(angle)]
    ]).valueOf();
}

/*
PŘEDDEFINOVÁNO
*/
function getRotationYMatrix(angle) {
    return math.matrix([
        [Math.cos(angle), 0, Math.sin(angle)],
        [0, 1, 0],
        [-Math.sin(angle), 0, Math.cos(angle)]
    ]).valueOf();
}

/*
PŘEDDEFINOVÁNO
*/
function getRotationZMatrix(angle) {
    return math.matrix([
        [Math.cos(angle), -Math.sin(angle), 0],
        [Math.sin(angle), Math.cos(angle), 0],
        [0, 0, 1]
    ]).valueOf();
}

/*
FUNGUJE
*/
function getUnitMatrix() {
    return math.matrix([
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
    ]).valueOf();
}

/*
SPOČÍTÁ DÉLKU DANÉHO VEKTORU V0.2.3 J.L.
*/
function getVecLen(endPoint, startPoint=[0, 0, 0]) {
    [x0, y0, z0] = startPoint;
    [x1, y1, z1] = endPoint;
    console.log('x0, y0, z0', x0, y0, z0);
    console.log('x1, y1, z1', x1, y1, z1);
    return Math.sqrt((x1 - x0)**2 + (y1 - y0)**2 + (z1 - z0)**2);
}

/*
FUNGUJE D.D.
*/
function getVectorFromTwoPoints(a, b) {
    //bod A,B, vector V = AB->:
    // B-A = V
    return [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
}

/*
FUNGUJE D.D.
*/
function getVectorInBase(vector, base) {
    // base 3*3, vector 1*3
    //nasobeni vectoru
    return multiplyMatrices(vector, base);
    /*xn = base[0][0]*vector[0]+base[0][1]*vector[1]+base[0][2]*vector[2];
    yn = base[1][0]*vector[0]+base[1][1]*vector[1]+base[1][2]*vector[2];
    zn = base[2][0]*vector[0]+base[2][1]*vector[1]+base[2][2]*vector[2];
    return [xn,yn,zn];*/
}

/*
FUNGUJE D.D.
*/
function getEndPoint(originPoint, vector) {
    //endPoint-OriginPoint = vector
    return [vector[0] + originPoint[0], vector[1] + originPoint[1], vector[2] + originPoint[2]];
}

/*
NETESTOVÁNO V0.3 J.L.
*/
function modifyLenghtOfVector(vector, length) {
    //u = (lenght/|vector|)*vector
    len = length / getLenght(vector);
    return [len * vector[0], len * vector[1], len * vector[2]];
};

function degToRad(deg) {
    return  deg / 180 * Math.PI
}

function arrFromVec(vec) {
    return [vec.x, vec.y, vec.z];
}

const Vector = function (arr) {
    this.x = arr[0];
    this.y = arr[1];
    this.z = arr[2];
    
    this.getArray = function () {
        return [this.x, this.y, this.z];
    }
};

// TURTLE
/*
NETESTOVÁNO V0.2.3 J.L.
*/
const Turtle = function (positions=[0, 0, 0], rotations=[0, 0, 0], color='green') {
    this.pos = new Vector(positions);
    [rotX, rotY, rotZ] = rotations;
    //////////////////console.log('arrFromVec(this.rot)', arrFromVec(this.rot));
    ////console.log('this.pos.x, this.pos.y, this.pos.z', this.pos.x, this.pos.y, this.pos.z);
    //// console.log('this.pos', this.pos);    
    this.penIsDown = true;
    this.color = color;
    
    this.transofrmationM = getUnitMatrix();
    this.transofrmationM = multiplyMatrices(getRotationXMatrix(degToRad(rotX)), this.transofrmationM);
    this.transofrmationM = multiplyMatrices(getRotationYMatrix(degToRad(rotY)), this.transofrmationM);
    this.transofrmationM = multiplyMatrices(getRotationZMatrix(degToRad(rotZ)), this.transofrmationM);
    console.log('this.transofrmationM', this.transofrmationM);
    this.inverseM = matrixInvert(this.transofrmationM);

    this.oldBase = getUnitMatrix();
    this.newBase = getUnitMatrix();

    this.originPoint = [-2, 0, -2];
    this.endPoint = [0, 0, 0];

    this.vector = [0, 1, 0];

    this.rollRight = function (angle) {
        rad = - angle / 180 * Math.PI;
        console.log('angle, rad', angle, rad);
        console.log('this.transofrmationM', this.transofrmationM);
        this.transofrmationM = multiplyMatrices(getRotationYMatrix(rad), this.transofrmationM);
        console.log('this.transofrmationM', this.transofrmationM);
        //angle = Math.PI * angle / 180;
        //this.newBase = multiplyMatrices(this.oldBase, getRotationYMatrix(angle));
        ///                console.log('oldBase:', this.oldBase, 'newBase:', this.newBase);
    };

    this.rollLeft = function (angle) {
        rad = angle / 180 * Math.PI;
        console.log('angle, rad', angle, rad);
        console.log('this.transofrmationM', this.transofrmationM);
        this.transofrmationM = multiplyMatrices(getRotationYMatrix(rad), this.transofrmationM);
        console.log('this.transofrmationM', this.transofrmationM);
        //angle = 2 * Math.PI - (Math.PI * angle / 180);
        //this.newBase = multiplyMatrices(this.oldBase, getRotationYMatrix(angle));
        ///                 console.log('oldBase:', this.oldBase, 'newBase:', this.newBase);
    };

    this.turnRight = function (angle) {
        rad = - angle / 180 * Math.PI;
        console.log('angle, rad', angle, rad);
        console.log('this.transofrmationM', this.transofrmationM);
        this.transofrmationM = multiplyMatrices(getRotationZMatrix(rad), this.transofrmationM);
        console.log('this.transofrmationM', this.transofrmationM);
        //angle = Math.PI * angle / 180;
        //this.newBase = multiplyMatrices(this.oldBase, getRotationXMatrix(angle));
        ///                   console.log('oldBase:', this.oldBase, 'newBase:', this.newBase);
    };

    this.turnLeft = function (angle) {
        rad = angle / 180 * Math.PI;
        console.log('angle, rad', angle, rad);
        console.log('this.transofrmationM', this.transofrmationM);
        this.transofrmationM = multiplyMatrices(getRotationZMatrix(rad), this.transofrmationM);
        console.log('this.transofrmationM', this.transofrmationM);
        //angle = 2 * Math.PI - (Math.PI * angle / 180);
        //this.newBase = multiplyMatrices(this.oldBase, getRotationXMatrix(-angle));
        ///                   console.log('oldBase:', this.oldBase, 'newBase:', this.newBase);
    };

    this.up = function (angle) {
        rad = angle / 180 * Math.PI;
        console.log('angle, rad', angle, rad);
        console.log('this.transofrmationM', this.transofrmationM);
        this.transofrmationM = multiplyMatrices(getRotationXMatrix(rad), this.transofrmationM);
        console.log('this.transofrmationM', this.transofrmationM);
        //angle = Math.PI * angle / 180;
        //this.newBase = multiplyMatrices(this.oldBase, getRotationZMatrix(angle));
        ///                     console.log('oldBase:', this.oldBase, 'newBase:', this.newBase);
    };

    this.down = function (angle) {
        rad = - angle / 180 * Math.PI;
        console.log('angle, rad', angle, rad);
        console.log('this.transofrmationM', this.transofrmationM);
        this.transofrmationM = multiplyMatrices(getRotationXMatrix(rad), this.transofrmationM);
        console.log('this.transofrmationM', this.transofrmationM);
        //angle = 2 * Math.PI - (Math.PI * angle / 180);
        //this.newBase = multiplyMatrices(this.oldBase, getRotationZMatrix(-angle));
        ///                     console.log('oldBase:', this.oldBase, 'newBase:', this.newBase);
    };

    this.penup = function () {
        this.penIsDown = false;
    };

    this.pendown = function () {
        this.penIsDown = true;
    };

    this.setPosition = function (x, y, z) {
        [this.pos.x, this.pos.y, this.pos.z] = [x, y, z];
        //console.log('arrFromVec(this.pos)', arrFromVec(this.pos));
        this.originPoint = [x, y, z];
    };

    this.setOrientation = function (orientation) {

    };

    /*
    Z BODŮ NAJDE STŘEDY, ÚHLY A DÉLKU, ZAVOLÁ DRAWCYLINDER J.L.
    */
   this.drawLine = function (endPos, startPos=arrFromVec(this.pos)) {
        //this.drawLine = function ([x1, y1, z1], [x0, y0, z0]=[0,0,0], len) {
        ///            console.log('startPos', startPos);
        console.log('startPos', startPos);
        [x0, y0, z0] = startPos;
        console.log('x0, y0, z0', x0, y0, z0);

        console.log('endPos', endPos);
        [x1, y1, z1] = endPos;
        console.log('x1, y1, z1', x1, y1, z1);

        centerPos = getMiddlePoint(startPos, endPos);
        console.log('centerPos:',centerPos);
        // STŘEDY VÁLCE V OSÁCH
        /*
        cX = centerPos[0];
        cY = centerPos[1];
        cZ = centerPos[2];
        */
        [cX, cY, cZ] = centerPos;
        console.log('cX,cY,cZ:',cX,cY,cZ);

        vector = getVectorFromTwoPoints(startPos, endPos);
        console.log('vector', vector);
        // DÉLKY JEDNOTLIVÝCH OS
        /*dX = x1 - x0;
        dY = y1 - y0;
        dZ = z1 - z0;*/
        [dX, dY, dZ] = vector;
        console.log('dX, dY, dZ:', dX, dY, dZ);

        /////////////////////this.endPoint = getEndPoint(this.originPoint, vector);
        ///         console.log('vector in unit Base:',vector);
        //change vector to rotated base
        ////////////////////////////vector = getVectorInBase(vector, this.newBase);
        ///        console.log('vector in Base:',vector);

        //get end point in unit base
        ///////////////////////this.endPoint = getEndPoint(this.originPoint, vector);
        //console.log('end point:',this.endPoint);

        //console.log('originPoint:',this.originPoint, 'endPoint:',this.endPoint);
        //middlePoint = getMiddlePoint(this.originPoint, this.endPoint);
        //console.log('middle point',middlePoint);

        vectorLen = getVecLen(vector);
        console.log('vectorLen', vectorLen);

        /*
        !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
        ROTACE SE UPLATŇUJÍ POPOŘADĚ, NEJDŘÍV X PAK Y PAK Z
        !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
        */

        // SPOČÍTÁ ROTACI V OSE X ROTX
        ///          console.log('dY/vectorLen:',dY/vectorLen);
        ///         console.log('Math.acos(dY/vectorLen):',Math.acos(dY/vectorLen));
        ///         console.log('Math.acos(dY/vectorLen)/Math.PI*180:',Math.acos(dY/vectorLen)/Math.PI*180);
        rotX = Math.acos(dY / vectorLen) / Math.PI * 180;
        console.log('rotX', rotX);

        // SPOČÍTÁ ROTACI V OSE Y, PODLE KVADRANTU BUĎ NECHÁ, NEBO ODEČTE OD 360 STUPŇŮ
        ///          console.log('dZ/Math.sqrt(dX**2+dZ**2)',dZ/Math.sqrt(dX**2+dZ**2));
        ///           console.log('Math.acos(dZ/Math.sqrt(dX**2+dZ**2))/Math.PI*180:',Math.acos(dZ/Math.sqrt(dX**2+dZ**2))/Math.PI*180);
        rotY180 = ((dX**2 + dZ**2) != 0)? Math.acos(dZ / Math.sqrt(dX**2 + dZ**2)) / Math.PI * 180: 0;
        console.log('rotY180', rotY180);
        //console.log("test of tanges", Math.tan(dX/dZ)/Math.PI*180)
        rotY = (dX > 0)? rotY180: 360 - rotY180;
        console.log('rotY', rotY);
        this.drawCylineder(centerPos, [rotX, rotY, 0], vectorLen);

        /*
        ZAKOMENTOVÁNO, LOGIKA OKOLU UKLÁDÁNÍ, transofrmationMACE JSEM NEZKOUMAL, TO BE DONE J.L.
        */

        ///////////////////////////////////len = getVecLen(this.originPoint, this.endPoint);
        //console.log('len',len);

        //z-roration
        ////////////////////rotY = Math.atan((this.endPoint[0] - this.originPoint[0]) / (this.endPoint[2] - this.originPoint[2]));
        //////////////////////////////////rotZ = Math.asin((this.endPoint[1] - this.originPoint[1]) / len);
        //console.log(rotY, rotZ);

        /////////////////rotZ = 180 * rotZ / Math.PI;
        //////////////////rotY = 180 * rotY / Math.PI;

        /////////////////////////console.log(rotY, rotZ);
        //turnDeg = turnDeg - 90; // rotation around z axis 0 means 90 turnDegrees in math
        /*
        let el = document.createElement('a-entity');

        start = this.originPoint[0] + ' ' + this.originPoint[1] + ' ' + this.originPoint[2];
        end = this.endPoint[0] + ' ' + this.endPoint[1] + ' ' + this.endPoint[2];
        color = '#000000';
        el.setAttribute('line', 'start:' + start + ';end:' + end + ';color:' + color);

        scene.appendChild(el);
        
        this.originPoint = this.endPoint;
        this.oldBase = this.newBase;
        */
    };

    /*
    JENOM NAKRESLÍ VÁLEC, SE STŘEDOVÝMI SOUŘADNICEMI, ROTACEMI A DÉLKOU V03 JL
    */
    this.drawCylineder = function (centerPos, rotations, len) {
        let el = document.createElement('a-cylinder');
        
        //zPos = -3; // z position
        var position = ''+centerPos[0]+' '+centerPos[1]+' '+centerPos[2];
        ///           console.log('position', position);
        el.setAttribute('position', position);
        el.setAttribute('height', len);
        
        rad = len / 10; // radius is 1/20 of length
        //rad = 10;

        el.setAttribute('radius', rad);
        el.setAttribute('color', this.color);
        
        var rotation = ''+rotations[0]+' '+rotations[1]+' '+((rotations[2] + 360) % 360);
        ///        console.log('rotation', rotation);
        el.setAttribute('rotation', rotation);
        el.setAttribute('shadow');
        scene.appendChild(el);
    };

    this.forward = function (length) {
        console.log('--- this.forward = function (length) ---');
        
        vector = [0, length, 0];
        console.log('vector', vector);

        console.log('this.transofrmationM', this.transofrmationM);
        this.inverseM = matrixInvert(this.transofrmationM);
        console.log('this.inverseM', this.inverseM);
        
        //console.log('this.transofrmationM == matrixInvert(this.inverseM)', this.transofrmationM == matrixInvert(this.inverseM));
        

        rotatedV = multiplyMatrices(this.inverseM, vector);
        console.log('rotatedV', rotatedV);

        //console.log(arrFromVec(this.pos));

        console.log('this.pos.getArray()', this.pos.getArray());
        newPos = addMatrices(this.pos.getArray(), rotatedV);
        //newPos = this.pos.getArray() + rotatedV;
        console.log('newPos', newPos);

        if (this.penIsDown) {
            this.drawLine(newPos, this.pos.getArray());
            this.setPosition(...newPos);
            
            /* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            var vectorInBase = getVectorInBase(this.vector, this.newBase);
            this.drawLine(modifyLenghtOfVector(vectorInBase, length));
            !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
        }

    };
}

// PLANT
/*
var viewPlant = function(s, step, angle){
    var len = s.length;
    this.stack = [];

    for (k = 0; k < len; k++) {
        switch (s.charAt(k)) {
        case 'F':
            t.forward(step);
            break;
        case '-':
            t.left(angle);
            break;
        case '+':
            t.right(angle);
            break;
        case '[':
            this.stack.push([[t.X, t.Y],t.heading])
            break;
        case ']':
            [p, h] = this.stack.pop();
            t.penup();
            t.setposition(p[0], p[1]);
            t.setheading(h);
            t.pendown();
            break;
        default:
            if(s.charAt(k) != 'X'){
                alert('INVALID CHARACTER OCCURED!');
            }
        }
    }
}
*/
/*
var plant = function(ch){
    switch(ch) {
    case 'X':
        return 'F+[[X]-X]-F[-FX]+X'
    case 'F':
        return 'FF'
    default:
        return ch;
    }
}
*/
/*
var getNextGen = function(sP){
    var sN = '';
    var len = sP.length;
    for (j = 0; j < len; j++) { 
        sN += plant(sP.charAt(j));
    }
    return sN;
}
*/
/*
const step_length = 0.03;
const turn_angle = 25;
const start_angle = 90;
const color = 'darkgreen'
*/

/*
var s = 'X';
var gens = 6;
var i;

for (i = 0; i < gens; i++) { 
    s = getNextGen(s);
    //console.log("generated string s", s)
    if (i == gens-1) {
        viewPlant(s, step_length, turn_angle);
    }
}
*/
/**
* + Turn left by angle α, using rotation matrix RU(α).
* − Turn right by angle α, using rotation matrix RU(−α).
* & Pitch down by angle α, using rotation matrix RL(α).
* ^ Pitch up by angle α, using rotation matrix RL(−α).
* \ Roll left by angle α, using rotation matrix RH(α).
* / Roll right by angle α, using rotation matrix RH(−α).
* | Turn around, using rotation matrix RU(180◦).
* 
* R = right, L = left
* U = Y axis
* L = X axis
* H = Z axis
* 
 
const r2 = 0.7;
const a1 = 10;
const a2 = 60;
const d = 137.5;
const wr = 0.707;
*/


/**
 * NETESTOVANO D.D
 */
const r1 = 0.9;

function getPlant1Prescription(originStr, generation) {
    var oldStr = originStr;
    var newStr = '';
    console.log('len of origin string', oldStr.length);
    while (generation > 0) {
        for (let i = 0; i < oldStr.length; i++) {
            switch (oldStr[i]) {
                case 'F':
                    newStr += 'Y[++++++MF][-----NF][^^^^^OF][&&&&&PF]';
                    break;
                case 'M':
                    newStr += 'Z-M';
                    break;
                case 'N':
                    newStr += 'Z+N';
                    break;
                case 'O':
                    newStr += 'Z&O';
                    break;
                case 'P':
                    newStr += 'Z^P';
                    break;
                case 'Y':
                    newStr += 'Z-ZY+';
                    break;
                case 'Z':
                    newStr += 'ZZ';
                    break;
                default:
                    break;
            }
        }
        oldStr = newStr;
        generation--;
    }
    return newStr;
}

function drawPlant(str, angle) {
    var stack = [];
    for (let i = 0; i < str.length; i++) {
        switch (str[i]) {
            case 'F':
                t.forward(r1);
                break;
            case '+':
                t.turnRight(angle);
                break;
            case '−':
                t.turnLeft(angle);
                break;
            case '&':
                t.pitchUp(angle);
                break;
            case '^':
                t.pitchDown(angle);
                break;
            case '\\':
                t.rollRight(angle);
                break;
            case '/':
                t.rollLeft(angle);
                break;
            case '|':
                t.turnLeft(180);
                break;
            case '[':
                stack.push([[t.X, t.Y], t.heading])
                break;
            case ']':
                [p, h] = stack.pop();
                t.penup();
                t.setposition(p[0], p[1]);
                t.setheading(h);
                t.pendown();
                break;
            default:
                break;
        }
    }
}

// MAIN

var STEP = 3;
var t = new Turtle([0, -5, -30], [0, 180, 0]);

t.forward(STEP);
t.turnRight(45);
t.forward(STEP);
t.turnRight(15);
t.forward(STEP);
t.turnRight(30);
t.forward(STEP);
t.turnLeft(45);
t.forward(STEP);
t.turnLeft(15);
t.forward(STEP);
t.turnLeft(30);
t.forward(STEP);


t.forward(STEP);
t.forward(STEP);
t.turnRight(30);
t.forward(STEP);
t.turnRight(30);
t.forward(STEP);
t.turnRight(30);
t.forward(STEP);
t.turnRight(30);
t.forward(STEP);
t.turnRight(30);
t.forward(STEP);
t.turnRight(30);
t.forward(STEP);
t.turnRight(30);
t.forward(STEP);
t.turnRight(30);
t.forward(STEP);
t.turnRight(30);
t.forward(STEP);
t.turnRight(30);
t.forward(STEP);
t.turnRight(30);
t.forward(STEP);
t.turnRight(30);
t.forward(STEP);

t.up(60);
t.forward(STEP);
t.up(60);
t.forward(STEP);
t.up(60);
t.forward(STEP);
t.forward(STEP);
t.forward(STEP);
t.down(60);
t.forward(STEP);
t.down(60);
t.forward(STEP);
t.down(60);
t.forward(STEP);

t.forward(STEP);
t.turnLeft(90);
t.forward(STEP);
t.rollLeft(90);
t.turnLeft(90);
t.forward(STEP);
t.turnLeft(90);
t.forward(STEP);

t.up(30);
t.rollRight(30);
t.turnRight(30);
t.forward(STEP);

t.down(90);
t.forward(STEP);
t.turnRight(90);
t.forward(STEP);

// t.drawCylineder([0,0,-30], [0,0,0], 10)
// t.drawLine([0, 5,-30], [0,-5,-30]);

//t.drawCylineder([0,0,-10], [30,0,0], 5)
//t.drawLine([0,0,-10], [10,-5,-20]);
//t.drawLine([0,0,-10], [-10,20,-25]);

//t.drawLine([-10,-10,-5]);

/*
t.turnRight(90);
t.forward(STEP);
t.turnRight(90);
t.forward(STEP);
*/


//// POMOCNÉ DEBUGGOVACÍ OBRAZCE, NA KTERÝCH JE DOBŘE VIDĚT JAK SETO CHOVÁ ////
// t.setPosition(10, 0, 100);
// console.log('t.pos', t.pos);    




/*
t.drawLine([1,0,0]);
t.rollRight(45);
t.drawLine([1,5,2]);
*/



var plantStr = '';
//              plantStr = getPlant1Prescription('F', 2);
//              console.log('plant1 string:', plantStr);
//drawPlant(plantStr,45);

