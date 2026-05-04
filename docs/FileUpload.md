# File Upload Flow
While adding a new file on the dashboard, user needs to either upload a file from the local system or provide a link to the already uploaded file at some storage platform. In this document, we will see how a file is uploaded from the user's local system.

To uploada file, we are using multipart upload system, i.e a file is divided into small size chunks and then each chunk is uploaded separately and later all the chunks are merged on the storage server such as AWS S3 Bucket, Oracle Cloud Object Storage Bucket etc. At this moment, AWS s3 Bucket is used and this document mentions the steps involved in uploading the file to AWS S3 Bucket but later the support can be provided for other storage providers as well.

The image below shows the steps involved in uploading a file 

![file_upload_flow](https://private-user-images.githubusercontent.com/54903857/383399614-da7363a6-d8e9-4760-bbc8-5054b2859bc9.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MzEwNjYxNzYsIm5iZiI6MTczMTA2NTg3NiwicGF0aCI6Ii81NDkwMzg1Ny8zODMzOTk2MTQtZGE3MzYzYTYtZDhlOS00NzYwLWJiYzgtNTA1NGIyODU5YmM5LnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDExMDglMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQxMTA4VDExMzc1NlomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWYyOTFiZWE0NGQ5NGYxMDE4NTRkYTAwNzBmYjFiYmM5YTY5MTAxM2ExYTllZTVmMzAxZjYyNDk2ZDJhNjQ0MDkmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.p61B7OAiFCEdqGcDDsnohkM61ht5bTx6vGLKkxkudGk)

As displayed in the image above, the file upload process involves 03 servers, the Client Application (ReactJS), the Backend API server (FastAPI) and the Storage Bucket (AWS S3 in this case). Apart from this, the Backend API Server also has a SQLite database to store details related to file uploads.

Let's go through each step one by one in detail:

1. In the first step, the user selects a file from the local system using the Client Aplication. Here we extract the basic details related to the file such as File Name, File Size, File Type, Last Modified Date, File Location etc. [Refer this link](https://developer.mozilla.org/en-US/docs/Web/API/File) to know how to get file details using the File API.
2. Next, the Client Application makes a POST request to the Backend API Server along with the File details to initiate the upload process.

   ```
   API Endpoint: "/initiate-file-upload"
   Request Type: "POST"
   Post Data: {
    file: {
      name: "file_name.txt",
      size: 1438234,
      lastmodified: 1731299778264
    }
   }
   ```
3. The Backend API Server receives the file details and based on the details it checks its local database if there is already an upload process initiated for the said file. If yes, then it returns the details of the previous upload process. The format of returned details will be like this-
   ```
   {
     "file": {
       "id": "abcde",
       "name": "file_name.txt",
       "size": 1438234,
       "lastModified": 1731299778264
     },
     "checksum": {
      "method": "crc32/crc32c/sha1/sha256"
     },
     "status": {
       "success": True,
       "errorMessage": ""
     }
   }
   ```

    However, if there is no previous record found for the said file, then the server creates a new unique key for the file and saves the key along-with the file details in the local database. The format of the new file data saved to the local database will be like this-
   ```
   {
     "id": "abced",
     "file_name": file_name.txt,
     "file_size": 1438234,
     "file_last_modified": 1731299778264,
     "checksum": {
       "method": "crc32/crc32c/sha1/sha256"
     }
   }
   ```
    then, the Backend API Server sends a request to S3 bucket for initiating the upload process. In case of AWS S3 bucket, we use the following boto3 API call:
    ```
    s3_client.create_multipart_upload(
       Bucket="aws_s3_bucket_name",
       Expires=datetime.now() + timedelta(minutes=15),
       Key="file_name.txt",
     )
    ```
    [Refer this link](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/s3/client/create_multipart_upload.html) for the documentation of this method.

    For complete documentation on Boto3, [refer this link.](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html)

    This action will initiate a multipart upload and return an upload ID. This upload ID is used to associate all of the parts in the specific multipart upload. This upload ID will be automatically associated with the each Presigned URL used to upload a chunk (We will come to Presigned URLs later). This upload ID will also be included in the final request to either complete or abort the multipart upload request. To know more about multipart uploads on AWS S3 [visit this link.](https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html)

4. For the "s3_client.create_multipart_upload" request, AWS S3 bucket will return the Upload Id in the response. The response will look like this-
    ```
    {
      'Bucket': 'aws_se_bucket_name',
      'Key': 'file_name.txt',
      'UploadId': 'ibZBv_75gd9r8lH_gqXatLdxMVpAlj6ZQjEs.OwyF3953YdwbcQnMA2BLGn8Lx12fQNICtMw5KyteFeHw.Sjng--',
      'ResponseMetadata': {
        '...': '...',
      },
   }
    ```

    Now the Backend API Server updates the local database with the UploadId and additional details. For S3 bucket, we are using another field "s3" to store the bucket response. If we add support for some other storage bucket in the future, we will add another field for the bucket accordingly. So the updated data stored to the local database will look like this-
    ```
    {
      id: "abcde",
      name: "file_name.txt",
      size: 1438234,
      lastModified: 1731299778264,
      checksum: {
        method: "crc32/crc32c/sha1/sha256"
      },
      s3: {
        Bucket: "aws_s3_bucket_name",
        Key: "file name.txt",
        UploadId: "upload id value",
        ...
      },
   }
    ```
5. Next, the Backend API server will return the unique file ID in the response to the frontend. The frontend should provide this unique file ID in the future API calls associated with this file. The s3 information will not be returned to the frontend at this stage. The response to the Frontend will look like this-
   ```
     {
       "file": {
         "id": "abcde",
         "name": "file_name.txt",
         "size": 1438234,
         "lastModified": 1731299778264
       },
       "checksum": {
          method: "crc32/crc32c/sha1/sha256"
        },
       "status": {
         "success": True,
         "errorMessage": ""
       }
     }
   ```
6. Now, the Frontend application makes a request to the Backend Api Server and provide the unique file Id to provide the chunk and presigned url information for the file. The request will look like this-
   ```
    API endpoint: "/update-file-part-urls"
    Request type: "POST"
    Payload: { file: { id: "abcde" } }
   ```

7. The Backend API server receives the unique file Id and retrieves the information related to the file from the local database. Based on the file size, the total number of chunks will be determined.
   
    The size of each chunk is set to 5 MiB i.e. (5 * 1024 * 1024).

    Data for each chunk will be generated by looping over the number of chunks. Each chunk data will contain "id" (id1, id2, id3...), "pos" (starting position for the chunk i.e. 0, 5Mib, 10Mib...), "length" (length of chunk i.e 5Mib, 6Mib, 10Mib..) and "status" for the chunk (which will be "upload_pending" at this point).

    The local database will be updated with the new file data containing parts info like this-
    ```
    {
      id: "abcde",
      name: "file_name.txt",
      size: 1438234, 
      lastModified: 1731299778264,
      checksum: {
        method: "crc32/crc32c/sha1/sha256"
      },
      s3: {
        Bucket: "aws_s3_bucket_name",
        Key: "file name.txt",
        UploadId: "upload id value",
        ...
      },
      parts: [
        { id: "id1", pos: 0, length: 5MiB, status: upload_pending},
        { id: "id2", pos: 5MiB, length: 5MiB, status: upload_pending},
        { id: "id3", pos: 10MiB, length: 5MiB, status: upload_pending},
        { id: "id4", pos: 15MB, length: 5MiB, status: upload_pending},
        { id: "id5", pos: 20MB, length: 5MiB, status: upload_pending},
        { id: "id6", pos: 25MB, length: 5MiB, status: upload_pending},
        { id: "id7", pos: 30MB, length: 5MiB, status: upload_pending},
      ]
    }
    ```
    Here, length of each parts is set to 5Mib, however it is not necessary that the size of each part should be same. However, as per the AWS S3 documentation, the minimum size of each chunk should be greater than or equal to 5MiB.

    The Backend API server will then request the AWS S3 bucket to generate the Presigned URL for each chunk by looping over each file part. The request will look like this-
    ```
    for idx, part_info in enumerate(file.parts):
    presigned_url = s3.generate_presigned_url(
      ClientMethod="upload_part",
      Params={
        "Bucket": "aws_s3_bucket_name",
        "Key": file_data.s3.Key,
        "UploadId": file_data.s3.UploadId,
        "PartNumber": idx,
      },
      ExpiresIn=3600,  # 1h
      HttpMethod="PUT",
    )
    ```

8. The AWS S3 Bucket will genarate a presigned url for each part and send to the Backend Api Server. The Backend API server will then create another field "s3" to each part_data to store the Presigned URL for that part.
   ```
   for idx, part_info in enumerate(file.parts):
    presigned_url = s3.generate_presigned_url(
      ClientMethod="upload_part",
      Params={
        "Bucket": AWS_S3_BUCKET,
        "Key": file.s3.Key,
        "UploadId": file.s3.UploadId,
        "PartNumber": idx,
      },
      ExpiresIn=3600,  # 1h
      HttpMethod="PUT",
    )
    part_info.s3 = {
      url: presigned_url
    }
   ```

   After this, each part_data will look something like this-
   ```
   { id: "id1", pos: 0, length: 4MB, status: upload_pending, s3: { url: "presigned url value 1"} }
   ```

   The Backend API server will then add this parts_data to the file_data and update the local database. The file_data at this point will look like this-
   ```
   {
      id: "abcde",
      name: "file_name.txt",
      size: 1438234, 
      lastModified: 1731299778264,
      s3: {
        Bucket: "aws_s3_bucket name",
        Key: "file name.txt",
        UploadId: "upload id value",
        ...
      },
      parts: [
        { id: "id1", pos: 0, length: 4MB, status: upload_pending, s3: { url: "presigned url value 1" } },
        { id: "id2", pos: 4MB, length: 4MB, status: upload_pending, s3: { url: "presigned url value 2" } },
        { id: "id3", pos: 8MB, length: 4MB, status: upload_pending, s3: { url: "presigned url value 3" } },
        { id: "id4", pos: 12MB, length: 4MB, status: upload_pending, s3: { url: "presigned url value 4" } },
        { id: "id5", pos: 16MB, length: 16MB, status: upload_pending, s3: { url: "presigned url value 5" } },
        { id: "id6", pos: 32MB, length: 16MB, status: upload_pending, s3: { url: "presigned url value 6" } },
        { id: "id7", pos: 48MB, length: 10MB, status: upload_pending, s3: { url: "presigned url value 7" } },
      ]
   }
   ```

9. Now the Backend API server will send the parts data to the frontend. However, the "s3" field in each part will be sent as "upload" field, because the frontend should not care which bucket is being used at the backend. So the parts data received at frontend will look like this-
    ```
    {
      parts: [
        { id: "id1", pos: 0, length: 4MB, status: upload_pending, upload: { url: "presigned url value 1", param: { ... } } },
        { id: "id2", pos: 4MB, length: 4MB, status: upload_pending, upload: { url: "presigned url value 2", param: { ... } } },
        { id: "id3", pos: 8MB, length: 4MB, status: upload_pending, upload: { url: "presigned url value 3", param: { ... } } },
        { id: "id4", pos: 12MB, length: 4MB, status: upload_pending, upload: { url: "presigned url value 4", param: { ... } } },
        { id: "id5", pos: 16MB, length: 16MB, status: upload_pending, upload: { url: "presigned url value 5", param: { ... } } },
        { id: "id6", pos: 32MB, length: 16MB, status: upload_pending, upload: { url: "presigned url value 6", param: { ... } } },
        { id: "id7", pos: 48MB, length: 10MB, status: upload_pending, upload: { url: "presigned url value 7", param: { ... } } },
      ]
    }
    ```

10. In this step, the frontend will receive the parts data and upload chunks to the Presigned URLs.
    
    The number of chunks can be hundreds or even thousands based on the file size. It is not optimum to upload all the chunks at the same time. So the chunks will be uploaded in set of 04 at a time.

    `maxNumberOfParallelUploads = 4`
    
    This step will be executes in a while loop. The condition for while loop will be such that if the number of parts "for which the value of "status" field is equal to 'upload_pending'" is greater that zero, only then the loop will execute. i.e
    ```
    while(parts?.filter(
      (part) => part?.status === "upload_pending"
    )?.length > 0) {
      // code for while loop here
    }
    ```
    Also, for the last batch, it is not necessary that the number of chunks will be exactly equal to 04. To handle this we will calculate the minimum of "maxNumberOfParallelUploads" and "number of parts whose status is upload pending".

    ```
    numberOfParallelUploads = Math.min(numberOfPartsWithStatusAsUploadPending, maxNumberOfParallelUploads)
    ```

    Then, we filter the parts to upload based on the numberOfParallelUploads.

    ```
    const partsToUpload = numberOfPartsWithStatusAsUploadPending?.slice(
      0,
      numberOfParallelUploads
    );
    ```
    Next, we check the expiry of the Presigned URLs. If the urls are not expired then we calculate the chunks based on the "part.pos" and "part.length" properties for each part.
    Then we upload the chunk by making the PUT request to the Presigned URL.
   
    When the upload for all the 04 parts is complete, a request to Backend API server will be made to update the part.status to "upload_complete".

    However, if the urls are expired, again a request to "/update-file-part-urls" is made to get the new urls.

    This step is divided into 04 parts. Let's see each part in detail:

    10.1 This step involves uploading the chunk to the S3 bucket using presigned url-


    First the chunk is calculated using the part.pos and part.length properties.
    ```
      url = part.upload.url;
      start = part.pos;
      end = part.pos + part.length;
      chunk = file.slice(start, end);
    ```

    Next, a PUT request to made to the Presigned URL along with the chunk
     ```
      fetch(url, {
        method: "PUT",
        body: chunk,
      })
    ```
    The checksum (MD5 hash) for the chunk is calculated parallely to the file upload.

    10.2 When the chunk is completely uploaded to the bucket, it will provide some response.

    10.3 This response will be sent back to the Backend API server along with the computed checksum for the chunk and the backend server will process this response based in the cloud storage provider. This will be sent using the followint endpoint-
    ```
    API endpoint: "/update-file-parts-status"
    Request type: "PUT"
    Payload:
    [
        {
            id: "id1", pos: 0, length: 5MiB,
            status: upload_performed,
            checksum: "checksum_value_1",
            upload: {
                url: "presigned url value 1",
                param: { ... },
                response: { bucket_response_output }
            }
        },
        {
            id: "id2", pos: 5MiB, length: 5MiB,
            status: upload_performed,
            checksum: "checksum_value_2",
            upload: {
                url: "presigned url value 2",
                param: { ... },
                response: { bucket_response_output }
            }
        },
    ]
    ```

    10.4 When the Backend API server receives the data in the above endpoint, it will update the part_data for the file in the local database.

    For each part in the payload data, part in the local database will be identified based in the part id.

    If the computed checksum and the checksum from the bucket response are mathcing and the status of the part is "upload_performed", the the status of the part in local database is set to "upload_verified".

    Also, additional details related to s3 will be added to each part data and save to database. The file data in local database at this point will look like this-
    ```
     {
        id: "abcde",
        name: "file_name.txt",
        size: number, 
        lastModified: time,
        s3: {
          Bucket: "aws_s3_bucket name",
          Key: "file name.txt",
          UploadId: "upload id value",
          ...
        },
        parts: [
          {
            id: "id1",
            pos: 0,
            length: 5MiB,
            status: upload_verified,
            s3: {
              url: "presigned url value 1",
              param: {...},
              response: {...}
            }
            upload: {
                success: True,
                errorMessage: None,
            }
          },
        ...,
        ]
     }
    ```
    After updating the database, the Backend will send the updated parts data information to the frontend in the response. The reponse will look like this-
    ```
    {
      partList: [
        {
         id: "id1",
         pos: 0,
         length: 5MiB,
         status: upload_verified,
         checksum: "checksum_value_1",
         upload: {
             url: "presigned url value 1",
             param: { ... },
             response: "s3 response 1",
             success: True,
             errorMessage: None,
         }
        },
        { id: "id2", pos: 5MiB, length: 5MiB, ... },
        { id: "id3", pos: 10MiB, length: 5MiB, ... },
        { id: "id4", pos: 15MiB, length: 5MiB, ... },
        { id: "id5", pos: 20MiB, length: 5MiB, ... },
        { id: "id6", pos: 25MiB, length: 5MiB, ... },
        { id: "id7", pos: 30MiB, length: 5MiB, ... },
      ],
    }
    ```
11. During the file part status update, if all the parts are uploaded, the backend API server will request the S3 bucket to merge the parts together and complete the upload process. For this operation the following s3 bucket api will be used-
    ```
      s3_client.complete_multipart_upload(
        Bucket=aws_s3_bucket,
        Key=key,
        MultipartUpload={"Parts": [
          {
            'ETag': '"d8c2eafd90c266e19ab9dcacc479f8af"',
            'PartNumber': '1',
          },
          {
            'ETag': '"d8c2eafd90c266e19ab9dcacc479f8af"',
            'PartNumber': '2',
          },
          ...
        ],},
        UploadId=upload_id,
      )
    ```

12. If the s3_client.complete_multipart_upload api is successful, the backend API server will update the database and store the bucket object URL and send a response to the frontend like this-
    ```
    {
      "status": {
        "status": True,
        "errorMessage": ""
      },
        "parts": parts,
        "upload_complete": False
      }
    ```
    Based on the "upload_complete" flag, the frontend can display the file upload status.