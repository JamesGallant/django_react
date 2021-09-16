import { render, fireEvent, waitFor } from '@testing-library/react';
import FlashError from '../flashErrors';


describe("Testing flashError component", () => {

    it("component renders correctly", () => {
        render(<FlashError message="" display={false}/>)
    });

    it("Component Displays", () => {
        const wrapper = render(<FlashError message="Hello" display={true} />);
        expect(wrapper.getByText("Hello")).toBeInTheDocument();
    });

    it("Component does not Display", () => {
        const wrapper = render(<FlashError message="Hello" display={false} />);
        expect(wrapper.queryByText("Hello")).not.toBeInTheDocument();
    })

    it("Component dissapears on button click", async () => {
        const wrapper = render(<FlashError message="Hello" display={true} />);
        const button = wrapper.getByRole('button')

        await waitFor(() => {

            fireEvent.click(button)
        })
       
        expect(wrapper.queryByText("Hello")).not.toBeInTheDocument()
    })
})