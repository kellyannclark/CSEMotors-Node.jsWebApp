INSERT INTO public.account(
	 account_firstname, account_lastname, account_email, account_password)
	VALUES ( 'Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

UPDATE public.account
	SET account_type= 'Admin'
	WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

DELETE FROM public.account
	WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

    
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

SELECT inv.inv_make, inv.inv_model, cls.classification_name
FROM public.inventory AS inv
INNER JOIN public.classification AS cls
ON inv.classification_id = cls.classification_id
WHERE cls.classification_name = 'Sport';

UPDATE public.inventory
SET inv_image = CONCAT(SUBSTRING(inv_image FROM 1 FOR POSITION('/images/' IN inv_image) + 7), 'vehicles', SUBSTRING(inv_image FROM POSITION('/images/' IN inv_image) + 8)),
    inv_thumbnail = CONCAT(SUBSTRING(inv_thumbnail FROM 1 FOR POSITION('/images/' IN inv_thumbnail) + 7), 'vehicles', SUBSTRING(inv_thumbnail FROM POSITION('/images/' IN inv_thumbnail) + 8))

