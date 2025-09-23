import React, { useState } from "react";

import { Label } from "../../../components/ui/label";

import { Input } from "../../../components/ui/input";

import { Button } from "../../../components/ui/button";
import { amharicRegex } from '../../../utils/amharic-regex';



const AddDepartmentForm = () => {

  const [newDepartment, setNewDepartment] = useState({

    name: "",

    nameAm: "",

  });



  const handleAmharicChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const value = e.target.value;

    if (amharicRegex.test(value)) {

      setNewDepartment((prev) => ({ ...prev, nameAm: value }));

    }

  };



  const handleSubmit = () => {

    console.log("Submitted:", newDepartment);

    // Save logic here

  };



  return (

    <div className="space-y-6">

      <div className="grid grid-row-2 gap-4 py-4">

        <div className="flex flex-col gap-2">

          <Label htmlFor="nameAm">የዲፓርትመንት ስም<span className='text-red-500'>*</span></Label>

          <input

            id="nameAm"

            value={newDepartment.nameAm}

            onChange={handleAmharicChange}

            placeholder="ፋይናንስ"

            className="w-full px-3 py-2 focus:outline-none focus:border-emerald-500 focus:outline-2 border rounded-md"

          />

        </div>

        <div className="flex flex-col gap-2">

          <Label htmlFor="name">Department Name<span className='text-red-500'>*</span></Label>

          <input

            id="name"

            value={newDepartment.name}

            onChange={(e) =>

              setNewDepartment((prev) => ({ ...prev, name: e.target.value }))

            }

            placeholder="Finance"

            className='w-full px-3 py-2 focus:outline-none focus:border-emerald-500 focus:outline-2 border rounded-md'

          />

        </div>

      </div>



      <div className="flex justify-end">

        <Button

          className="bg-green-600 hover:bg-green-700 text-white"

          onClick={handleSubmit}

        >

          Save

        </Button>

      </div>

    </div>

  );

};



export default AddDepartmentForm;
