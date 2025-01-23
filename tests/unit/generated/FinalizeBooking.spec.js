import { mount } from "@vue/test-utils"
import { describe, it, expect, beforeEach, vi } from "vitest"
import FinalizeBooking from "@/views/bookings/FinalizeBooking.vue"

// A helper function to create the wrapper using `mount`.
function createWrapper(options = {}) {
  // Provide a default "booking" prop so the component won't error out.
  const defaultProps = {
    booking: {
      id: "booking123",
      guestID: "guestABC",
    },
  }

  return mount(FinalizeBooking, {
    props: defaultProps,
    ...options,
  })
}

describe("FinalizeBooking.vue", () => {
  let wrapper

  beforeEach(() => {
    wrapper = createWrapper()
  })

  it("mounts without error", () => {
    expect(wrapper.exists()).toBe(true)
  })

  it("requires a booking prop", async () => {
    // If you want to see how it behaves with no prop, you can do:
    // (But note, 'type: Object, required: true' will warn)
    // For coverage, let's confirm it *does* accept a valid booking object.
    expect(wrapper.props("booking")).toEqual({
      id: "booking123",
      guestID: "guestABC",
    })
  })

  it("renders the correct heading and instructions", () => {
    const heading = wrapper.find("h2")
    expect(heading.exists()).toBe(true)
    expect(heading.text()).toBe("Finalize Your Booking")

    expect(wrapper.text()).toContain("Please complete any outstanding steps to confirm your booking.")
  })

  it("displays booking details if booking prop is present", () => {
    // The default booking is { id: 'booking123', guestID: 'guestABC' }
    // We should see those IDs in <p> elements
    expect(wrapper.text()).toContain("Booking ID: booking123")
    expect(wrapper.text()).toContain("Guest ID: guestABC")
  })

  it("renders a Pay Now button", () => {
    const payButton = wrapper.find(".pay-button")
    expect(payButton.exists()).toBe(true)
    expect(payButton.text()).toBe("Pay Now")
  })

  it("calls onPayNow() when the Pay Now button is clicked", async () => {
    // Spy on the console.log or on the method itself
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {})

    const payButton = wrapper.find(".pay-button")
    await payButton.trigger("click")

    // Expect the console.log inside onPayNow to have been called
    expect(logSpy).toHaveBeenCalledWith(
      "User clicked Pay Now for booking:",
      "booking123"
    )

    // Restore console.log
    logSpy.mockRestore()
  })
})

