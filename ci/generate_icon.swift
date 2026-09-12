import AppKit

let output = CommandLine.arguments.count > 1 ? CommandLine.arguments[1] : "AppIcon-1024.png"
let size = NSSize(width: 1024, height: 1024)
let image = NSImage(size: size)
image.lockFocus()
let bg = NSGradient(colors: [
    NSColor(calibratedRed: 0.42, green: 0.82, blue: 0.98, alpha: 1),
    NSColor(calibratedRed: 0.54, green: 0.86, blue: 0.38, alpha: 1)
])!
bg.draw(in: NSRect(origin: .zero, size: size), angle: -90)
NSColor(calibratedRed: 0.76, green: 0.36, blue: 0.10, alpha: 1).setFill()
NSBezierPath(ovalIn: NSRect(x: 202, y: 202, width: 620, height: 620)).fill()
NSColor(calibratedRed: 1.0, green: 0.72, blue: 0.24, alpha: 1).setFill()
NSBezierPath(ovalIn: NSRect(x: 292, y: 292, width: 440, height: 440)).fill()
NSColor.black.setFill()
NSBezierPath(ovalIn: NSRect(x: 395, y: 520, width: 42, height: 60)).fill()
NSBezierPath(ovalIn: NSRect(x: 587, y: 520, width: 42, height: 60)).fill()
NSColor.white.setFill()
NSBezierPath(ovalIn: NSRect(x: 407, y: 550, width: 13, height: 17)).fill()
NSBezierPath(ovalIn: NSRect(x: 599, y: 550, width: 13, height: 17)).fill()
NSColor(calibratedRed: 0.27, green: 0.14, blue: 0.10, alpha: 1).setFill()
let nose = NSBezierPath()
nose.move(to: NSPoint(x: 512, y: 475))
nose.line(to: NSPoint(x: 475, y: 510))
nose.line(to: NSPoint(x: 549, y: 510))
nose.close()
nose.fill()
image.unlockFocus()
let rep = NSBitmapImageRep(data: image.tiffRepresentation!)!
let data = rep.representation(using: .png, properties: [:])!
try data.write(to: URL(fileURLWithPath: output))
