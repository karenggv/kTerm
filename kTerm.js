// Configure initial data
const data = {
    prefix: "~ karen$ ",
    showDate: true,
    showBattery: true,
    showEvents: true,
    maxEvents: 2
}

// Font
let fontName = "Menlo"
let boldFontName = "Menlo-bold"
let fontSize = 12

// Principal Colors
const backgroundColor = new Color("#272B36")
const barColor = new Color("#D7D7D7")

// Text color
const primaryTextColor = new Color("#c38bd9")
const secondaryTextColor = new Color("#FFF")

// Bar circles
const barColors = [
    "#E94B35",
    "#F2C600",
    "#19AF5C"
]

// Current date
const now = new Date()

// Widget
let widget = new ListWidget()
widget.backgroundColor = backgroundColor
widget.setPadding(0, 0, 0, 0)

// Create top bar 
drawTopBar()

// Main stack
let stack = widget.addStack()
stack.layoutVertically()
stack.setPadding(5, 15, 5, 15)

if (data.showDate) {
    addTextStackWithPrefix("date")
    addText(now.toDateString())
}

if (data.showBattery) {
    addTextStackWithPrefix("battery")
    let battery = Math.round(Device.batteryLevel().toFixed(2) * 100)
    addText(`${battery.toString()}% 🔋 charging: ${Device.isCharging()}`)
}

if (data.showEvents) {
    const calendarEvents = await CalendarEvent.today([])
    let events = []

    addTextStackWithPrefix("cat events")

    for (const event of calendarEvents) {
        if (events.length == data.maxEvents) { break }
        if (event.startDate.getTime() > now.getTime() && !event.isAllDay && !event.title.startsWith("Canceled:")) {
            events.push(event)
        }
    }

    if (events.length == 0) {
        stack.addSpacer(8)
        addEventStack("No events!", "")
    } else {
        for (const e of events) {
            stack.addSpacer(8)
            let t = formatTime(e.startDate)
            addEventStack(t, e.title)
        }
    }
}

widget.addSpacer()

// Helpers
function drawTopBar() {
    let topStack = widget.addStack()
    topStack.backgroundColor = barColor
    topStack.spacing = 5
    topStack.setPadding(5, 15, 5, 15)
    topStack.centerAlignContent()

    barColors.forEach(circleColor => {
        let sf = SFSymbol.named("circle.fill")
        let img = topStack.addImage(sf.image)
        img.tintColor = new Color(circleColor)
        img.imageSize = new Size(10, 10)
    })

    topStack.addSpacer(config.widgetFamily == "small" ? 80 : 250)
}

function addText(text, color = secondaryTextColor) {
    let t = stack.addText(text)
    t.font = getFont()
    t.textColor = color
}

function addTextStackWithPrefix(text) {
    let textStack = stack.addStack()
    let prefix = textStack.addText(data.prefix)
    prefix.font = getFont(boldFontName)
    prefix.textColor = primaryTextColor

    let t = textStack.addText(text)
    t.font = getFont()
    t.textColor = secondaryTextColor
}

function addEventStack(text1, text2) {
    let textStack = stack.addStack()
    textStack.spacing = 5

    let t1 = textStack.addText(text1)
    t1.font = getFont(boldFontName)
    t1.textColor = secondaryTextColor

    let t2 = textStack.addText(text2)
    t2.font = getFont()
    t2.textColor = secondaryTextColor

    textStack.setPadding(0, 15, 0, 0)
}

function getFont(name = fontName, size = fontSize) {
    return new Font(name, size)
}

function formatTime(date) {
    let df = new DateFormatter()
    df.useNoDateStyle()
    df.useShortTimeStyle()
    var d = df.string(date)
    if (d.length < 5) {
        return "0" + d
    }
    return d
}

if (config.runsInWidget) {
    Script.setWidget(widget)
    Script.complete()
} else {
    widget.presentLarge()
}