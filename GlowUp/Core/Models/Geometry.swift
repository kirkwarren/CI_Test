import Foundation

/// A normalized bounding box in [0, 1] image space (origin top-left).
///
/// Defined independently of CoreGraphics so the detection-decision logic stays
/// portable and trivially unit-testable. The Vision-backed detector converts
/// from Vision's bottom-left normalized space into this convention.
public struct BoundingBox: Equatable, Codable, Hashable {
    public var x: Double
    public var y: Double
    public var width: Double
    public var height: Double

    public init(x: Double, y: Double, width: Double, height: Double) {
        self.x = x
        self.y = y
        self.width = width
        self.height = height
    }

    public var area: Double { max(0, width) * max(0, height) }

    public var centerX: Double { x + width / 2 }
    public var centerY: Double { y + height / 2 }

    public var maxX: Double { x + width }
    public var maxY: Double { y + height }

    /// Area of overlap with another box.
    public func intersectionArea(_ other: BoundingBox) -> Double {
        let ix = max(x, other.x)
        let iy = max(y, other.y)
        let iMaxX = min(maxX, other.maxX)
        let iMaxY = min(maxY, other.maxY)
        let w = max(0, iMaxX - ix)
        let h = max(0, iMaxY - iy)
        return w * h
    }

    /// Intersection-over-union with another box (0 = disjoint, 1 = identical).
    public func iou(_ other: BoundingBox) -> Double {
        let inter = intersectionArea(other)
        let union = area + other.area - inter
        guard union > 0 else { return 0 }
        return inter / union
    }
}
