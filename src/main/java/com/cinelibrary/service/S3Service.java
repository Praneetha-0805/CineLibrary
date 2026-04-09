package com.cinelibrary.service;

import com.amazonaws.services.s3.AmazonS3;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;

@Service
public class S3Service {

    @Autowired
    private AmazonS3 amazonS3;

    private final String bucketName = "cinelibrary-images";

    public String uploadFile(MultipartFile file) {
        try {
            File convertedFile = convertMultiPartToFile(file);
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

            amazonS3.putObject(bucketName, fileName, convertedFile);

            return amazonS3.getUrl(bucketName, fileName).toString();

        } catch (Exception e) {
            throw new RuntimeException("Upload failed");
        }
    }

    private File convertMultiPartToFile(MultipartFile file) throws Exception {
        File convFile = new File(file.getOriginalFilename());
        FileOutputStream fos = new FileOutputStream(convFile);
        fos.write(file.getBytes());
        fos.close();
        return convFile;
    }
}