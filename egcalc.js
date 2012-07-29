/* Author: alfer (goldenalfer@gmail.com) */

function SP(i) {
	var temp ='' + i;
	var ret = '';
	if(temp.length>0) {
		var i = temp.length - 3;
		for(; i>=0; i=i-3) {
			ret = temp.substring(i, i+3) + (ret.length>0? ' ' : '')+ ret;
		}
		if(i<0) ret = temp.substring(0, 3 + i) + (ret.length>0? ' ' : '') + ret;
	}
	return ret;
}

/* Классы технологий */
function Technology() {
	this.Order = 1;
	this.Level = 1;
	this.Name = "Технология";
	this.MaxLevel = 0;
	this.MinLevel = 1;
	
	this.PrintBlock = "#PrintAbility";
	this.ToPrint = function() {
		return false;
	}
	this.TooltipHeader = function() {
		return "<h3>" + this.Name + " " + this.Level + "/" + this.MaxLevel + "</h3>";
	}
	
	this.TooltipBottom = function() {
		return this.MaxLevel>1? "<small>Ctrl - посмотреть все неизученные технологии<br />Shift - посмотреть все технологии</small>" : "";
	}
	this.TooltipMain = function(level) {
		return "";
	}
	this.TooltipPrint = function () {
		return this.TooltipHeader() + this.TooltipMain() + (this.Level<this.MaxLevel?this.TooltipMain(this.Level+1):"") + this.TooltipBottom();
	}
	this.TooltipFullPrint = function(startLevel) {
		if(startLevel===undefined || startLevel<0) startLevel = this.Level;
		var ret = this.TooltipHeader()
		for(var i=startLevel; i<=this.MaxLevel; i++) {
			ret += this.TooltipMain(i);
		}
		ret += this.TooltipBottom();
		return ret;
	}
	this.TooltipLevelPrint = function(level) {
		if(level===undefined || level===this.Level) return "<h5 class='cur'>Текущий уровень</h5>";
		else if(level>this.Level) return "<h5>Следующий уровень " + level + "</h5>"
		else return "<h5>Предыдущий уровень " + level + "</h5>"
	}
}
var technology = new Technology();

function structTech() {
	this.Values = {0: 0, 1: 20000, 2: 40000, 3: 80000, 4: 140000, 5: 250000, 6: 450000}
	this.Order = 2;
	this.Name = "Структура";
	this.MaxLevel = 6;
	this.MinLevel = 0;
	this.Level = 0;
	this.PrintBlock = "#PrintMain";
	this.ToPrint = function(flagman) {
		return "<div class='lcol'>Структура:</div><div class='rcol value'>" + SP(this.ValueGet(flagman)) + "</div>";
	}
	this.ValueGet = function(flagman) {
		return flagman.Level*1000 + this.Values[this.Level];
	}
	this.TooltipMain = function (level) {
		if(level===undefined) level = this.Level;
		return "<div class='block'>" + this.TooltipLevelPrint(level) + "Флагман может выдержать дополнительных <span class='value'>" + SP(this.Values[level]) + "</span> ед. повереждений</div>";
	}
}
structTech.prototype = technology;
var struct = new structTech();

function shieldTech() {
	this.Order = 5;
	this.Name = "Щит";
	this.ToPrint = function(flagman) {
		return "<div class='lcol'>Щит:</div><div class='rcol value'>" + SP(this.ValueGet(flagman)) + "</div>";
	}
	this.TooltipMain = function (level) {
		if(level===undefined) level = this.Level;
		return "<div class='block'>" + this.TooltipLevelPrint(level) + "Энергетическое поле блокирует дополнительных <span class='value'>" + SP(this.Values[level]) + "</span> ед. повереждений</div>";
	}
}
shieldTech.prototype = struct;

function fuelTech() {
	this.Values = {0: 20, 1: 40, 2: 100 }
	this.Name = "Топливный бак";
	this.Level = 0;
	this.MaxLevel = 2;
	this.MinLevel = 0;
	this.PrintBlock = "#PrintAdditional";
	this.ToPrint = function() {
		return "<div class='lcol'>Топливо (макс):</div><div class='rcol value'>" + this.ValueGet() + "</div>";
	}
	this.ValueGet = function() {
		return this.Values[this.Level];
	}
	this.TooltipMain = function (level) {
		if(level===undefined) level = this.Level;
		return "<div class='block'>" + this.TooltipLevelPrint(level) + "Флагман может иметь запас топлива до <span class='value'>" + SP(this.Values[level]) + "</span> ед.</div>";
	}
}
fuelTech.prototype = technology;

function speedTech() {
	this.Order = 3;
	this.Name = "Скорость";
	this.Level = 0;
	this.MinLevel = 0;
	this.MaxLevel = 2;
	this.PrintBlock = "#PrintAdditional";
	this.ToPrint = function() {
		return "<div class='lcol'>Скорость:</div><div class='rcol value'>" + this.ValueGet() + "%</div>";
	}
	this.ValueGet = function(level) {
		if(level===undefined) level = this.Level;
		return 75 + level * 25;
	}
	this.TooltipMain = function (level) {
		if(level===undefined) level = this.Level;
		return "<div class='block'>" + this.TooltipLevelPrint(level) + "Флагман развивает <span class='value'>" + SP(this.ValueGet(level)) + "</span>% скорость.</div>";
	}
}
speedTech.prototype = technology;

function gravikTech() {
	this.Order = 21;
	this.Name = "Гравитор";
	this.MaxLevel = 3;
	this.PrintBlock = "#PrintAbility";
	this.ToPrint = function() {
		return "<div class='line bonus'>Гравитор на " + this.TimeGet() + "с (" + this.PeriodGet() + ")</div>";
	}
	this.PeriodGet = function(level) {
		if(level===undefined) level = this.Level;
		return 60 - (level-1)*15;
	}
	this.TimeGet = function(level) {
		if(level===undefined) level = this.Level;
		return 120 + (level-1)*90;
	}
	this.TooltipMain = function (level) {
		if(level===undefined) level = this.Level;
		if(level===0) return "<div class='block'>" + this.TooltipLevelPrint(level) + "У флагмана отсутствует гравитор.</div>";
		return "<div class='block'>" + this.TooltipLevelPrint(level) + "При активации гравитора раз в <span class='value'>" + SP(this.PeriodGet(level)) + "</span> минут, на орбиту планеты в течение <span class='value'>" + SP(this.TimeGet(level)) + "</span> секунд не могут выйти корабли.</div>";
	}
}
gravikTech.prototype = technology;

function coverTech() {
	this.Order = 13;
	this.Name = "Прикрытие";
	this.MaxLevel = 4;
	this.PrintBlock = "#PrintAbility";
	this.ToPrint = function() {
		return "<div class='line bonus'>" + this.Name + " (" + this.ValueGet() + ")</div>";
	}
	this.ValueGet = function(level) {
		if(level===undefined) level = this.Level;
		return 20 - (level-1)*5;
	}
	this.TooltipMain = function (level) {
		if(level===undefined) level = this.Level;
		if(level===0) return "<div class='block'>" + this.TooltipLevelPrint(level) + "Флагман не может прикрыть корабли.</div>";
		return "<div class='block'>" + this.TooltipLevelPrint(level) + "Флагман может прикрыть группу кораблей, чтобы они раз в <span class='value'>" + SP(this.ValueGet(level)) + "</span> минут могли покинуть орбиту боя.</div>";
	}
}
coverTech.prototype = technology;
var cover = new coverTech();

function accTech() {
	this.Order = 11;
	this.Name = "Ускорение";
	this.TooltipMain = function (level) {
		if(level===undefined) level = this.Level;
		if(level===0) return "<div class='block'>" + this.TooltipLevelPrint(level) + "Флагман не может покинуть орбиту боя.</div>";
		return "<div class='block'>" + this.TooltipLevelPrint(level) + "Флагман может покинуть орбиту боя раз в <span class='value'>" + SP(this.ValueGet(level)) + "</span> минут.</div>";
	}
}
accTech.prototype = cover;

function portalTech() {
	this.Order = 22;
	this.Name = "Портал";
	this.MaxLevel = 5;
	this.PrintBlock = "#PrintAbility";
	this.ToPrint = function() {
		return "<div class='line bonus'>" + this.Name + " для " + SP(this.CountGet()) + " кораблей (30)</div>";
	}
	this.CountGet = function(level) {
		if(level===undefined) level = this.Level;
		return 1000*level;
	}
	this.TooltipMain = function (level) {
		if(level===undefined) level = this.Level;
		if(level===0) return "<div class='block'>" + this.TooltipLevelPrint(level) + "Технология портала - <span class='value'>не изучена</span>.</div>";
		return "<div class='block'>" + this.TooltipLevelPrint(level) + "Флагман может открыть портал раз в <span class='value'>30</span> минут и быстро перебросить <span class='value'>" + SP(this.CountGet(level)) + "</span> кораблей.</div>";
	}
}
portalTech.prototype = technology;

function catchTech() {
	this.Order = 31;
	this.Name = "Перехват";
	this.MaxLevel = 1;
	this.PrintBlock = "#PrintAbility";
	this.ToPrint = function() {
		return "<div class='line bonus'>" + this.Name + "</div>";
	}
	this.TooltipMain = function (level) {
		if(level===undefined) level = this.Level;
		if(level===0) return "<div class='block'>" + this.TooltipLevelPrint(level) + "Вражеские корабли могут покинуть орбиту боя.</div>";
		return "<div class='block'>" + this.TooltipLevelPrint(level) + "Вражеские корабли без прекрытия или ускорения не могут покинуть орбиту боя за исключением орбит звезд.</div>";
	}
}
catchTech.prototype = technology;
var catchT = new catchTech();

function radarTech() {
	this.Order = 12;
	this.Name = "Радар";
	this.MaxLevel = 5;
	this.PrintBlock = "#PrintAdditional";
	this.ToPrint = function() {
		return "<div class='lcol'>" + this.Name + ":</div><div class='rcol value'>" + this.ValueGet() + "</div>";
	}
	this.ValueGet = function(level) {
		if(level===undefined) level = this.Level;
		return 10*level;
	}
	this.TooltipMain = function (level) {
		if(level===undefined) level = this.Level;
		if(level===0) return "<div class='block'>" + this.TooltipLevelPrint(level) + "Технология радара - <span class='value'>не изучена</span>.</div>";
		return "<div class='block'>" + this.TooltipLevelPrint(level) + "Радар флагмана может обнаружить корабли, преодолевая помехи до <span class='value'>" + SP(this.ValueGet(level)) + "</span> уровня.</div>";
	}
}
radarTech.prototype = technology;
var radar = new radarTech();

function silencerTech() {
	this.Order = 11;
	this.Name = "Глушак";
	this.MaxLevel = 4;
	this.ValueGet = function (level) {
		if(level===undefined) level = this.Level;
		return level * 10 + 5;
	}
	this.TooltipMain = function (level) {
		if(level===undefined) level = this.Level;
		if(level===0) return "<div class='block'>" + this.TooltipLevelPrint(level) + "Технология постановки помех - <span class='value'>не изучена</span>.</div>";
		return "<div class='block'>" + this.TooltipLevelPrint(level) + "Генерирует помехи <span class='value'>" + SP(this.ValueGet(level)) + "</span> уровня, что препятствует обнаружению кораблей.</div>";
	}
}
silencerTech.prototype = radar;

function kvantTech() {
	this.Order = 33;
	this.Name = "Квантовый переход";
	this.TooltipMain = function (level) {
		if(level===undefined) level = this.Level;
		if(level===0) return "<div class='block'>" + this.TooltipLevelPrint(level) + "Квантовый переход - <span class='value'>не изучен</span>.</div>";
		return "<div class='block'>" + this.TooltipLevelPrint(level) + "Раз в <span class='value'>30</span> минут может мгновенно обменять Ваши корабли на вражеские корабли, находящиеся на другой планете.</div>";
	}
}
kvantTech.prototype = catchT;

function anchorTech() {
	this.Order = 34;
	this.Name = "Квантовый якорь";
	this.TooltipMain = function (level) {
		if(level===undefined) level = this.Level;
		if(level===0) return "<div class='block'>" + this.TooltipLevelPrint(level) + "Квантовый якорь - <span class='value'>не изучен</span>.</div>";
		return "<div class='block'>" + this.TooltipLevelPrint(level) + "Блокирует квантовые перемещения всех ваших флагманов.</div>";
	}
	this.TooltipBottom = function() {
		return "<div class='value'>Для изучения требуется 26 защитных технологий</div>";
	}
}
anchorTech.prototype = catchT;

function defenceTech() {
	this.Name = "Броня";
	this.Order = 1;
	this.MaxLevel = 4;
	this.PrintBlock = "#PrintMain";
	this.ToPrint = function() {
		return "<div class='lcol'>" + this.Name + ":</div><div class='rcol bonus'>+" + this.ValueGet() + "%</div>";
	}
	this.ValueGet = function(level) {
		if(level===undefined) level = this.Level;
		return 5*level;
	}
	this.TooltipMain = function (level) {
		if(level===undefined) level = this.Level;
		if(level===0) return "<div class='block'>" + this.TooltipLevelPrint(level) + "Броня флагмана не уменьшает полученный урон.</div>";
		return "<div class='block'>" + this.TooltipLevelPrint(level) + "Броня флагмана уменьшает полученный урон на <span class='value'>" + SP(this.ValueGet(level)) + "</span>%.</div>";
	}
}
defenceTech.prototype = technology;
var defence = new defenceTech();

function dispersiaTech() {
	this.Order = 4;
	this.Name = "Рассеивание";
	this.ValueGet = function(level) {
		if(level===undefined) level = this.Level;
		return 10*level;
	}
	this.TooltipMain = function (level) {
		if(level===undefined) level = this.Level;
		if(level===0) return "<div class='block'>" + this.TooltipLevelPrint(level) + "Энергетическое поле получет максимальный урон.</div>";
		return "<div class='block'>" + this.TooltipLevelPrint(level) + "Урон энергетическому полю уменьшается на <span class='value'>" + SP(this.ValueGet(level)) + "</span>%.</div>";
	}
}
dispersiaTech.prototype = defence;

function regenTech() {
	this.Values = {0: 50, 1: 200, 2: 300, 3: 400, 4: 600 };
	this.Order = 6;
	this.Name = "Регенерация";
	this.Level = 0;
	this.MinLevel = 0;
	this.MaxLevel = 4;
	this.PrintBlock = "#PrintMain";
	this.ToPrint = function() {
		return "<div class='lcol'>" + this.Name + ":</div><div class='rcol value'>" + SP(this.ValueGet()) + " (" + SP(this.PValueGet()) + ")</div>";
	}
	this.ValueGet = function(level) {
		if(level===undefined) level = this.Level;
		return this.Values[level];
	}
	this.PValueGet = function(level) {
		if(level===undefined) level = this.Level;
		return 3*this.Values[level];
	}
	this.TooltipMain = function (level) {
		if(level===undefined) level = this.Level;
		return "<div class='block'>" + this.TooltipLevelPrint(level) + "Энергетическое поле восстанавливает <span class='value'>" + SP(this.ValueGet(level)) + "</span>ед. в секунду. В режиме поляризации щита: <span class='value'>" + SP(this.PValueGet(level)) + "</span> ед. в секунду</div>";
	}
}
regenTech.prototype = technology;
var regen = new regenTech();

function repairTech() {
	this.Name = "Ремонт";
	this.Order = 3;
	this.MaxLevel = 4;
	this.PrintBlock = "#PrintMain";
	this.ToPrint = function() {
		return "<div class='lcol'>" + this.Name + ":</div><div class='rcol value'>" + SP(this.ValueGet()) + "</div>";
	}
	this.ValueGet = function(level) {
		if(level===undefined) level = this.Level;
		return 200*level;
	}
	this.TooltipMain = function (level) {
		if(level===undefined) level = this.Level;
		if(level===0) return "<div class='block'>" + this.TooltipLevelPrint(level) + "Флагман не ремонтирует структуру.</div>";
		return "<div class='block'>" + this.TooltipLevelPrint(level) + "Флагман ремонтирует <span class='value'>" + SP(this.ValueGet(level)) + "</span> структуры в секунду.</div>";
	}
}
repairTech.prototype = technology;

function protonkaTech() {
	this.Order = 17;
	this.Name = "Протонный щит";
	this.Names = { 1: this.Name, 2: "Массовый протонный щит" }
	this.MaxLevel = 2;
	this.PrintBlock = "#PrintAbility";
	this.ToPrint = function() {
		return "<div class='line bonus'>" + this.Names[this.Level] + " (30)</div>";
	}
	this.TooltipMain = function (level) {
		if(level===undefined) level = this.Level;
		if(level===0) return "<div class='block'>" + this.TooltipLevelPrint(level) + "Флагман не оснащен протонным щитом.</div>";
		else if(level===1) return "<div class='block'>" + this.TooltipLevelPrint(level) + "При активации флагман становится неуязвимым к повреждению на <span class='value'>2</span> минуты.</div>";
		else return "<div class='block'>" + this.TooltipLevelPrint(level) + "При активации весь флот на орбите становится неуязвимым к повреждению на <span class='value'>2</span> минуты.</div>";
	}
}
protonkaTech.prototype = technology;
var protonka = new protonkaTech();

function invisibleTech() {
	this.Order = 32;
	this.Name = "Невидимость";
	this.Names = { 1: this.Name, 2: "Массовая невидимость" };
	this.ToPrint = function() {
		return "<div class='line bonus'>" + this.Names[this.Level] + "</div>";
	}
	this.TooltipMain = function (level) {
		if(level===undefined) level = this.Level;
		if(level===0) return "<div class='block'>" + this.TooltipLevelPrint(level) + "Технология невидимости флагмана - <span class='value'>не изучена</span>.</div>";
		else if(level===1) return "<div class='block'>" + this.TooltipLevelPrint(level) + "Вне боя флагман невидим.</div>";
		else return "<div class='block'>" + this.TooltipLevelPrint(level) + "Вне боя флот невидим на орбите с флагманом.</div>";
	}
}
invisibleTech.prototype = protonka;

function maksimTech() {
	this.Values = {0: 100, 1: 200, 2: 400, 3: 600, 4: 900, 5: 1200}
	this.Bonuses = {1: 25, 2: 50, 3: 100, 4: 125 };
	this.Name = "Пушка";
	this.MaxLevel = 5;
	this.MinLevel = 1;
	this.PrintBlock = "#PrintAtack";
	this.Level = 1;
	this.ToPrint = function(flagman) {
		return "<div class='lcol'>" + this.Name + ":</div><div class='rcol value'>" + SP(this.ValueGet()) + (this.BonusGet(flagman)>0?("<span class='bonus'> +" + SP(Math.round(this.ValueGet()* this.BonusGet(flagman)/100)) + "</span>"):"") + "</div>";
	}
	this.ValueGet = function(level) {
		if(level===undefined) level = this.Level;
		return this.Values[level];
	}
	this.BonusGet = function(flagman) {
		if(flagman.Techs!==undefined && flagman.Techs['accuracy']!==undefined) return this.Bonuses[flagman.Techs['accuracy'].Level];
		return 0;
	}
	this.TooltipMain = function (level) {
		if(level===undefined) level = this.Level;
		if(level===0) return "<div class='block'>" + this.TooltipLevelPrint(level) + "У флагмана отсутствует пушка.</div>";
		return "<div class='block'>" + this.TooltipLevelPrint(level) + "Пушка флагмана наносит <span class='value'>" + SP(this.ValueGet(level)) + "</span> урона в секунду.</div>";
	}
}
maksimTech.prototype = technology;
var maksim = new maksimTech();

function laserTech() {
	this.Values = {1: 250, 2: 500, 3: 800, 4: 1100, 5: 1400}
	this.Order = 2;
	this.Name = "Лазер";
	this.MinLevel = 1;
	this.Level = 1;
	this.TooltipMain = function (level) {
		if(level===undefined) level = this.Level;
		if(level===0) return "<div class='block'>" + this.TooltipLevelPrint(level) + "У флагмана отсутствует лазер.</div>";
		return "<div class='block'>" + this.TooltipLevelPrint(level) + "Лазер флагмана наносит <span class='value'>" + SP(this.ValueGet(level)) + "</span> урона в секунду.</div>";
	}
}
laserTech.prototype = maksim;

function katushaTech() {
	this.Values = {1: 50, 2: 700, 3: 1100, 4: 1500 }
	this.Order = 3;
	this.Name = "Ракеты";
	this.MinLevel = 1;
	this.Level = 1;
	this.MaxLevel = 4;
	this.ValueGet = function(level) {
		if(level===undefined) level = this.Level;
		return this.Values[level];
	}
	this.TooltipMain = function (level) {
		if(level===undefined) level = this.Level;
		if(level===0) return "<div class='block'>" + this.TooltipLevelPrint(level) + "У флагмана отсутствуют ракеты.</div>";
		return "<div class='block'>" + this.TooltipLevelPrint(level) + "Ракеты флагмана наносят <span class='value'>" + SP(this.ValueGet(level)) + "</span> урона в секунду.</div>";
	}
}
katushaTech.prototype = maksim;

function accuracyTech() {
	this.Values = {1: 25, 2: 50, 3: 100, 4: 125 };
	this.MaxLevel = 4;
	this.ToPrint = function() {return "";}
	this.TooltipMain = function (level) {
		if(level===undefined) level = this.Level;
		if(level===0) return "<div class='block'>" + this.TooltipLevelPrint(level) + "Ударная сила флагмана не увеличивается.</div>";
		return "<div class='block'>" + this.TooltipLevelPrint(level) + "Ударная сила флагмана увеличивается на <span class='value'>" + SP(this.Values[level]) + "</span>%.</div>";
	}
}
accuracyTech.prototype = technology;

function minaTech() {
	this.Order = 8;
	this.Values = { 1: 100, 2: 500, 3: 2000, 4: 10000 };
	this.Name = "Мины";
	this.MaxLevel = 4;
	this.PrintBlock = "#PrintAtack";
	this.ToPrint = function() {
		return "<div class='lcol'>" + this.Name + ":</div><div class='rcol value'>" + SP(this.ValueGet()) + "</div>";
	}
	this.ValueGet = function(level) {
		if(level===undefined) level = this.Level;
		return this.Values[level];
	}
	this.TooltipMain = function (level) {
		if(level===undefined) level = this.Level;
		if(level===0) return "<div class='block'>" + this.TooltipLevelPrint(level) + "Флагман не может устанавливать мины.</div>";
		return "<div class='block'>" + this.TooltipLevelPrint(level) + "Флагман может установить до <span class='value'>" + SP(this.ValueGet(level)) + "</span> мин в орбитальный слот.</div>";
	}
}
minaTech.prototype = technology;

function xakepTech() {
	this.Order = 22;
	this.Values = { 1: 1, 2: 2, 3: 4, 4: 6, 5: 8, 6: 10 };
	this.Name = "Хакерство";
	this.MaxLevel = 6;
	this.PrintBlock = "#PrintAdditional";
	this.ToPrint = function() {
		return "<div class='lcol'>" + this.Name + ":</div><div class='rcol value'>" + this.ValueGet() + "</div>";
	}
	this.ValueGet = function(level) {
		if(level===undefined) level = this.Level;
		return this.Values[level];
	}
	this.TooltipMain = function (level) {
		if(level===undefined) level = this.Level;
		if(level===0) return "<div class='block'>" + this.TooltipLevelPrint(level) + "Технология взлома систем - <span class='value'>не изучена</span>.</div>";
		return "<div class='block'>" + this.TooltipLevelPrint(level) + "Каждую секунду <span class='value'>" + SP(this.ValueGet(level)) + "</span> кораблей из вражеского отряда подвергаются взлому бортовых систем. Что в свою очередь ведет к <span class='value'>15%</span> шансу перехода кораблей под ваше командование.</div>";
	}
}
xakepTech.prototype = technology;

function chargerTech() {
	this.Order = 15;
	this.Values = { 1: 40000, 2: 80000, 3: 160000, 4: 320000 };
	this.Name = "Зарядник";
	this.MaxLevel = 4;
	this.PrintBlock = "#PrintAbility";
	this.ToPrint = function() {
		return "<div class='line bonus'>" + this.Name + " " + SP(this.ValueGet()) + " (10)</div>";
	}
	this.ValueGet = function(level) {
		if(level===undefined) level = this.Level;
		return this.Values[level];
	}
	this.TooltipMain = function (level) {
		if(level===undefined) level = this.Level;
		if(level===0) return "<div class='block'>" + this.TooltipLevelPrint(level) + "Технология зарядчика - <span class='value'>не изучена</span>.</div>";
		return "<div class='block'>" + this.TooltipLevelPrint(level) + "Раз в <span class='value'>10</span> минут зарядчик позволяет восстановаить <span class='value'>" + SP(this.ValueGet(level)) + "</span> ед. напряжения щита.</div>";
	}
}
chargerTech.prototype = technology;
var charger = new chargerTech();

function legoTech() {
	this.Order = 16;
	this.Name = "Конструктор";
	this.TooltipMain = function (level) {
		if(level===undefined) level = this.Level;
		if(level===0) return "<div class='block'>" + this.TooltipLevelPrint(level) + "Технология конструктора - <span class='value'>не изучена</span>.</div>";
		return "<div class='block'>" + this.TooltipLevelPrint(level) + "Раз в <span class='value'>10</span> минут можно разобрать как дружественные, так и вражеские корабли для восстановления <span class='value'>" + SP(this.ValueGet(level)) + "</span> структуры флагмана.</div>";
	}
}
legoTech.prototype = charger;

function transTech() {
	this.Values = { 1: 300, 2: 500, 3: 700, 4: 1000 };
	this.Order = 4;
	this.Name = "Трансивер";
	this.Level = 1;
	this.MinLevel = 1;
	this.PrintBlock = "#PrintAtack";
	this.TooltipMain = function (level) {
		if(level===undefined) level = this.Level;
		if(level===0) return "<div class='block'>" + this.TooltipLevelPrint(level) + "У флагмана отсутствует трансиверный лазер.</div>";
		return "<div class='block'>" + this.TooltipLevelPrint(level) + "Трансиверный лазер восстанавливает <span class='value'>" + SP(this.ValueGet(level)) + "</span>ед. напряжения энергетического поля в секунду. В режиме поляризации щита: <span class='value'>" + SP(this.PValueGet(level)) + "</span> ед. в секунду.</div>";
	}
}
transTech.prototype = regen;

function sensorTech() {
	this.Order = 21;
	this.Counts = {1: 20, 2:40, 3: 80, 4: 120}
	this.Name = "Сенсор";
	this.MaxLevel = 4;
	this.PrintBlock = "#PrintAdditional";
	this.ToPrint = function() {
		return "<div class='lcol'>" + this.Name + ":</div><div class='rcol value'>" + this.ValueGet() + " / " + this.CountGet() + "</div>";
	}
	this.ValueGet = function(level) {
		if(level===undefined) level = this.Level;
		return level*2;
	}
	this.CountGet = function(level) {
		if(level===undefined) level = this.Level;
		return this.Counts[level];
	}
	this.TooltipMain = function (level) {
		if(level===undefined) level = this.Level;
		if(level===0) return "<div class='block'>" + this.TooltipLevelPrint(level) + "Технология обнаружения мин - <span class='value'>не изучена</span>.</div>";
		return "<div class='block'>" + this.TooltipLevelPrint(level) + "Флагман обнаруживает мины на дистанции <span class='value'>" + SP(this.ValueGet(level)) + "</span> орбитальныйх слотов, а также уничтожает вражеские мины из пушки или лазера с эффективностью <span class='value'>" + SP(this.CountGet(level)) + "</span> мин в секунду.</div>";
	}
}
sensorTech.prototype = technology;

function sinhrofazatronTech() {
	this.Order = 7;
	this.Name = "Ресинхронизатор";
	this.MaxLevel = 3;
	this.PrintBlock = "#PrintMain";
	this.ToPrint = function() {
		return "<div class='lcol'>" + this.Name + ":</div><div class='rcol minus'>-" + this.ValueGet() + "%</div>";
	}
	this.ValueGet = function(level) {
		if(level===undefined) level = this.Level;
		return level * 5;
	}
	this.TooltipMain = function (level) {
		if(level===undefined) level = this.Level;
		if(level===0) return "<div class='block'>" + this.TooltipLevelPrint(level) + "Технология ресинхронизации - <span class='value'>не изучена</span>.</div>";
		return "<div class='block'>" + this.TooltipLevelPrint(level) + "Броня и рассеивание вражеских кораблей на орбите с флагманом падает на <span class='value'>" + SP(this.ValueGet(level)) + "</span>%.</div>";
	}
}
sinhrofazatronTech.prototype = technology;
/* ------------------ */


var GUI = new function() {
	this.BranchesCount = 0;	//Количество веток
	this.RowsCount = 0;		//Количество строк в каждой ветке
	this.ColsCount = 0;		//Количество столбцов в каждой строке
	
	this.PointsBlock = [];	//Список блоков, в которые вовдится количество очков в ветке
	
	this.Init = function(Flagman, branchesCount, rowsCount, colsCount, pointsBlocks) {
		this.BranchesCount = branchesCount;
		this.RowsCount = rowsCount;
		this.ColsCount = colsCount;
		this.PointsBlock = pointsBlocks;
		
		this.LevelSet(Flagman.Level);
		this.NameSet(Flagman.Name);
		this.PlayerSet(Flagman.Player);
		this.TechsPrint(Flagman.Techs);
		this.ExperiencePrint(Flagman);
		this.PointsPrint(Flagman.Cells);
	}
	
	this.LevelSet = function(lvl) {
		$("#Level").text(lvl);
	}
	
	this.NameSet = function(name) {
		$("#CapName").val(name);
	}
	
	this.PlayerSet = function(player) {
		$("#Player").val(player);
	}
	
	this.CellSelect = function(t, y, x) {
		var a = "#cell_" + t + "_" + y + "_" + x;
		$("div", a).addClass("selected").removeClass("lock");
		if(Flagman.Cells[t-1].Rows[y-1].Count>=2) this.RowUnlock(t, y);
		if(t==2 && Flagman.Cells[t-1].Count>=26)  this.AnchorUnlock();
		if(this.PointsBlock[t-1]!==undefined) { $(this.PointsBlock[t-1]).text(Flagman.Cells[t-1].Count); }
	}
	
	this.CellDeselect = function(t, y, x) {
		var a = "#cell_" + t + "_" + y + "_" + x;
		$("div", a).removeClass("selected");
		if(Flagman.Cells[t-1].Rows[y-1].Count<2) this.RowLock(t, y);
		if(t==2 && Flagman.Cells[t-1].Count<26) this.AnchorLock();
		if(this.PointsBlock[t-1]!==undefined) { $(this.PointsBlock[t-1]).text(Flagman.Cells[t-1].Count); }
	}
	
	this.RowUnlock = function(t, y) {
		var c = "cell_" + t + "_" + (y+1);
		$("a.tech").each(function(i, v) {
			if($(v).attr("id").indexOf(c)>=0) $("div", v).not(".anchor").removeClass("lock");
		})
	}
	
	this.AnchorUnlock = function() {
		$("#cell_2_8_1 div").removeClass("lock");
	}
	
	this.RowLock = function(t, y) {
		var c = "cell_" + t + "_" + (y+1);
		$("a.tech").each(function(i, v) {
			if($(v).attr("id").indexOf(c)>=0) $("div", v).addClass("lock");
		})
	}
	
	this.AnchorLock = function() {
		$("#cell_2_8_1 div").addClass("lock");
	}
	
	this.TechsPrint = function(techs) {
		$(".line").remove();
		$(".lcol").remove();
		$(".rcol").remove();
		var techsTemp = [];
		for(var i in techs) {
			techsTemp.push(techs[i]);
			//var v = techs[i];
		}
		
		techsTemp.sort(function(a, b) {
			return a.Order - b.Order;
		});
		
		for(var i in techsTemp) {
			var v = techsTemp[i];
			$(v.PrintBlock).append(v.ToPrint(Flagman));
		}
	}
	
	this.PointsPrint = function(cells) {
		for(var i=0; i<this.PointsBlock.length; i++) {	
			var count = 0;
			if(cells[i+1]!==undefined) count = cells[i+1].Count;
			$(this.PointsBlock[i]).text(count);
		}
	}
	
	this.LoadBuild = function(build) {
		var x = 1, y = 1, t = 1;
		var anchor = false;
		for(var i in build) {
			if(build[i]==1) { 
				var a = "#cell_" + t + "_" + y + "_" + x;
				if($(a).length>0) {
					var c = $("div", $(a)).attr("class").replace('lock', '').replace('selected', '').replace(new RegExp(" ",'g'), "");
					if(t===2 && y===8 && x===1 && c==="anchor") anchor = true;
					else if(Flagman.TechAdd(t-1, y-1, x-1, c)) 
						this.CellSelect(t, y, x);
				}
			}
			x++;
			if(x>GUI.ColsCount) { x=1; y++; }
			if(y>GUI.RowsCount) { y=1; t++; }
		}
		if(anchor && Flagman.TechAdd(1, 7, 0, "anchor")) 
			this.CellSelect(2, 8, 1);
		this.TechsPrint(Flagman.Techs);
		this.ExperiencePrint(Flagman);
		this.UrlSet(MyURL.MakeUrl(Flagman));
	}
	
	this.UrlSet = function(url) {
		$("#URL").val(url);
	}
	
	this.ExperiencePrint = function(flagman) {
		$("#Expirience").text(SP(flagman.ExperienceGet()));
		$("#ExpirienceNext").text(SP(flagman.ExperienceGet(flagman.Level + 1) - flagman.ExperienceGet()));
	}
}

var Flagman = new function () {
	this.Order = 1;
	this.Level = 1;
	this.BaseTechs = function() { return { fuel: new fuelTech(), struct: new structTech(), shield: new shieldTech(), speed: new speedTech(), regen: new regenTech() }; }
	this.Techs = this.BaseTechs();
	this.Name = 'Имя капитана';
	this.Player = 'Имя игрока';
	this.Cells = [];
	
	this.Reset = function(t) {
		if(t===undefined) {
			this.Level = 1;
			this.Techs = this.BaseTechs();
			this.Cells = [];
		} else {
			if(this.Cells[t]===undefined || this.Cells[t].Count===0) return;
			//Отмена технологий происходит с последней строки (если мы будет отменять технологии с первой строки, то сработает блок, потому что при отмене технологии проверяется, нет ли зависимых тех)
			for(var y = GUI.RowsCount-1; y>= 0; y--) {
				for(var x =0; x<GUI.ColsCount; x++) {
					if(this.Cells[t].Rows[y]!==undefined && this.Cells[t].Rows[y].Cols[x]!==undefined) {
						if(this.TechRemove(t, y, x, this.Cells[t].Rows[y].Cols[x]))
							GUI.CellDeselect(t+1, y+1, x+1);
					}
				}
			}
		}
	}
	
	this.LevelUp = function(i) {
		this.Level = this.Level + i;
		GUI.LevelSet(this.Level);
	}
	
	this.TechAdd = function(t, y, x, c) {
		if(Flagman.Level>=50) return false;
		
		if((t<0 || t>=GUI.BranchesCount) || (y<0 || y>=GUI.RowsCount) || (x<0 || x>=GUI.ColsCount)) return false;
		if(!c) return false;
		
		if(y>0) {
			//Проверка на наличие выбранных 2 клеток выше в дереве технологий (в каждой строке)
			if(this.Cells[t]===undefined) return false;
			
			for(var i=0; i<y; i++) {
				if(this.Cells[t].Rows[i]===undefined) return false;
				if(this.Cells[t].Rows[i].Count<2) return false;
			}
			
			//Проверка на квантовый якорь (должно быть 26 технологий)
			if(t==1 && y==7 && x==0 && this.Cells[t].Count<26) return false;
		}
		
		//Добавляем таблицу, строку, столбец в данные флагмана
		if(this.Cells[t]===undefined) this.Cells[t] = { Count: 0, Rows: [] };
		this.Cells[t].Count++;
		if(this.Cells[t].Rows[y]===undefined) this.Cells[t].Rows[y] = {Count: 0, Cols: []};
		this.Cells[t].Rows[y].Count++;
		this.Cells[t].Rows[y].Cols[x] = c;
		
		//Добавляем технологию
		if(this.Techs[c]!==undefined) this.Techs[c].Level ++;
		else this.Techs[c] = eval("new " + c + "Tech()");
		
		this.LevelUp(1);
		
		return true;
	}
	
	this.TechRemove = function(t, y, x, c) {
		if((t<0 || t>=GUI.BranchesCOunt) || (y<0 || y>=GUI.RowsCount) || (x<0 || x>=GUI.ColsCount)) return false;
		if(!c) return false;
		
		if(this.Cells[t].Rows[y].Count<=2) {
			//Проверяем, нет ли зависимых тех
			for(var i=y+1; i<GUI.RowsCount; i++)
			{
				if(this.Cells[t].Rows[i]!==undefined && this.Cells[t].Rows[i].Count>0) return false;
			}
		}
		
		//Проверка на квантовый якорь (нельзя отменить теху, если выбран якорь и тех станет меньше 26)
		if(t==1 && !(y==7 && x==0) && this.Cells[t].Count<=27 && this.Cells[t].Rows[7]!=undefined && this.Cells[t].Rows[7].Cols[0]!=undefined) return false;
		
		delete(this.Cells[t].Rows[y].Cols[x]);
		this.Cells[t].Rows[y].Count --;
		this.Cells[t].Count --;
		
		//Удаляем технологию
		if(this.Techs[c].Level-1<this.Techs[c].MinLevel) delete(this.Techs[c]);
		else this.Techs[c].Level--;
		
		this.LevelUp(-1);
		return true;
	}
	
	this.BuildGetBitArray = function() {
		var bitArray = [];
		for(var t=0; t<GUI.BranchesCount; t++) {
			for(var y=0; y<GUI.RowsCount; y++) {
				for(var x=0; x<GUI.ColsCount; x++) {
					if(this.Cells[t]!==undefined && this.Cells[t].Rows[y]!==undefined && this.Cells[t].Rows[y].Cols[x]!==undefined) bitArray.push(1); else bitArray.push(0);
				}
			}
		}
		return bitArray;
	}
	
	this.ExperienceGet = function(level) {
		if(level===undefined) level = this.Level;
		return Math.round(level * (level - 1) * (2 * level - 1) * 400 / 6);
	}
}

var MyURL = new function() {
	this.BaseUrl = '';
	this.Parse = function() {
		this.BaseUrl = window.location.href;
		var params = this.BaseUrl.substr(this.BaseUrl.indexOf('#'));
		if(this.BaseUrl.indexOf('#')>=0) this.BaseUrl = this.BaseUrl.substr(0, this.BaseUrl.indexOf('#'));
		
		var build = "", name = "", player = "";
		var pos;
		
		if((pos = params.indexOf('#b:'))>=0) 
			if(params.indexOf('#', pos+3)>=0) build = params.substr(pos+3, params.indexOf('#', pos+3)-pos-3);
			else build = params.substr(pos+3);
			
		if((pos = params.indexOf('#n:'))>=0) 
			if(params.indexOf('#', pos+3)>=0) name = params.substr(pos+3, params.indexOf('#', pos+3)-pos-3);
			else name = params.substr(pos+3);
		
		try { name = decodeURIComponent(name); } catch(e) { name = ''; }
		
		if((pos = params.indexOf('#p:'))>=0) 
			if(params.indexOf('#', pos+3)>=0) player = params.substr(pos+3, params.indexOf('#', pos+3)-pos-3);
			else player = params.substr(pos+3);
			
		try { player = decodeURIComponent(player); } catch(e) { player = ''; }
		
		if(name) Flagman.Name = name;
		if(player) Flagman.Player = player;
		return {build: build, name: name, player: player};
	}
	
	this.HexToBitArr = function (h) {
		var ret = [];
		for(var i in h) {
			var dec = parseInt(h[i], 16);
			if(isNaN(dec)) return false;
			
			for(var i =0; i<4; i++)
			{
				ret.push(dec%2);
				dec = Math.floor(dec / 2);
			}
		}
		return ret;
	}
	
	this.BitArrToHex = function(bitArr) {
		var ret = "";
		var j = 0;
		var num = 0;
		for(var i in bitArr) {
			num += Math.pow(2, j) * bitArr[i];
			j++;
			if(j==4) {
				ret += num.toString(16);
				j = 0;
				num = 0;
			}
		}
		return ret;
	}
	
	this.MakeUrl = function(flagman) {
		return this.BaseUrl + '#b:' + this.BitArrToHex(flagman.BuildGetBitArray()) + (flagman.Name!= 'Имя капитана'?  '#n:' + encodeURIComponent(flagman.Name) : '') + (flagman.Player!='Имя игрока'? '#p:' + encodeURIComponent(flagman.Player) : '');
	}
}

var MyTooltip = new function() {
	this.CurrentTech = false;
	this.Full = false;
	this.FromFirst = false;
	this.Print = function(a) {
		this.CurrentTech = a;
		var c = $("div", $(a)).attr("class").replace('lock', '').replace('selected', '').replace(new RegExp(" ",'g'), "");
		$("#tooltip *").remove();
		if(!this.Full) {
			if(Flagman.Techs[c]!==undefined) $("#tooltip").append(Flagman.Techs[c].TooltipPrint());
			else $("#tooltip").append(eval("var t = new " + c + "Tech(); t.Level = 0; t.TooltipPrint()"));
		} else {
			if(Flagman.Techs[c]!==undefined) $("#tooltip").append(Flagman.Techs[c].TooltipFullPrint(this.FromFirst?0:-1));
			else $("#tooltip").append(eval("var t = new " + c + "Tech(); t.Level = 0; t.TooltipFullPrint(this.FromFirst?0:-1)"));
		}
	}
	this.RePrint = function() {
		if(this.CurrentTech) this.Print(this.CurrentTech);
	}
}

function Click(t, y, x) {
	var a = "#cell_" + t + "_" + y + "_" + x;
	var c = $("div", $(a)).attr("class").replace('lock', '').replace('selected', '').replace(new RegExp(" ",'g'), "");
	if($("div", a).hasClass("selected")) {
		//Отмена техологии
		if(Flagman.TechRemove(t-1, y-1, x-1, c)) 
		{
			GUI.CellDeselect(t, y, x);
			GUI.TechsPrint(Flagman.Techs);
			GUI.ExperiencePrint(Flagman);
			GUI.UrlSet(MyURL.MakeUrl(Flagman));
		}
	} else {
		//Выбор технологии
		if(Flagman.TechAdd(t-1, y-1, x-1, c))
		{
			GUI.CellSelect(t, y, x);
			GUI.TechsPrint(Flagman.Techs);
			GUI.ExperiencePrint(Flagman);
			GUI.UrlSet(MyURL.MakeUrl(Flagman));
		}
	}
	MyTooltip.Print(a);
}